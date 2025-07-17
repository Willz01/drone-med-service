package drx.drone.service.drone_med_service.service;

import drx.drone.service.drone_med_service.dto.DroneRequest;
import drx.drone.service.drone_med_service.dto.MedRequest;
import drx.drone.service.drone_med_service.exception.ErrorResponse;
import drx.drone.service.drone_med_service.exception.MedicationNotFoundException;
import drx.drone.service.drone_med_service.model.Drone;
import drx.drone.service.drone_med_service.model.Medication;
import drx.drone.service.drone_med_service.model.State;
import drx.drone.service.drone_med_service.model.WeightModel;
import drx.drone.service.drone_med_service.repository.DroneRepository;
import drx.drone.service.drone_med_service.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DroneService {

    private final DroneRepository droneRepository;
    private final MedicationRepository medicationRepository;

    /**
     *
     * @param droneRequest -
     *                     Serial Number - Unique Identifier generated on atlas on creation
     *                     Battery Capacity - defaulted at a 100% on drone registering
     *                     Weight class - Enum [LIGHT_WEIGHT, MIDDLE_WEIGHT, CRUISER_WEIGHT, HEAVY_WEIGHT]
     *                     Weight Limit - max 500 grams depending on drone's weight class
     *                     State - Enum [IDLE, LOADING, LOADED, DELIVERING, RETURNING]. Defaulted to STATE.IDLe on registering
     *                     Loaded medications - {}
     *
     * @return - returns Optional of Drone
     */
    public Optional<Drone> registerDrone(DroneRequest droneRequest){
        Drone drone = Drone.builder()
                .serialNumber(droneRequest.getSerialNumber())
                .batteryCapacity(100)
                .weightClass(droneRequest.getWeightClass())
                .weightLimit(setWeightLimit(droneRequest.getWeightClass()))
                .state(State.IDLE) // Default = State.Idle
                .loadedMeds(new ArrayList<>())
                .build();
        droneRepository.save(drone);
        return Optional.of(drone);
    }

    public Optional<Drone> getDroneById(String serialNumber){
        return droneRepository.findById(serialNumber);
    }

    public float setWeightLimit(WeightModel weightModel){
        float weightLimit = 0;
        switch (weightModel){
            case HEAVY_WEIGHT -> weightLimit = 500;
            case MIDDLE_WEIGHT -> weightLimit = 400;
            case LIGHT_WEIGHT -> weightLimit = 200;
            case CRUISER_WEIGHT -> weightLimit = 100;
        }
        return weightLimit;
    }

    public ErrorResponse loadDrone(String serialNumber, MedRequest medRequest) throws Exception {
        Optional<Drone> optionalDrone = droneRepository.findById(serialNumber);
        if (optionalDrone.isPresent()) {
            Drone drone = optionalDrone.get();

            // Check battery capacity
            if (drone.getBatteryCapacity() <= 25) {
                return new ErrorResponse("601", "BATTERY LEVEL BELOW 25%");
            }

            float medWeight = medRequest.getWeight();
            float totalLoadedWeight = getTotalLoadedWeight(drone);
            float droneWeightLimit = drone.getWeightLimit();
            float maxAllowableWeight = droneWeightLimit * 0.9f; // 90% of weight limit for safety

            // Check maximum medication count
            int maxMedCount = 10;
            if (drone.getLoadedMeds().size() >= maxMedCount) {
                drone.setState(State.LOADED);
                droneRepository.save(drone);
                return new ErrorResponse("602", "MAXIMUM MEDICATION COUNT REACHED");
            }

            // Check safe weight threshold
            /*if (medWeight + totalLoadedWeight > maxAllowableWeight) {
                drone.setState(State.LOADED);
                droneRepository.save(drone);
                return new ErrorResponse("605", "EXCEEDS SAFE WEIGHT THRESHOLD");
            }*/

            // Proceed with loading
            if (medWeight + totalLoadedWeight <= droneWeightLimit) {
                Medication medication = buildMedication(medRequest);
                medicationRepository.save(medication);

                String medID = medication.getId();
                drone.getLoadedMeds().add(medID);
                drone.setState(State.LOADING);
                drone.setBatteryCapacity(drone.getBatteryCapacity() - 15);

                droneRepository.save(drone);
                return new ErrorResponse("200", "MEDS LOADED");
            } else {
                drone.setState(State.LOADED);
                droneRepository.save(drone);
                return new ErrorResponse("600", "DRONE OVER WEIGHT");
            }
        } else {
            return new ErrorResponse("603", "DRONE DOES NOT EXIST");
        }
    }

    public Medication buildMedication(MedRequest request){
        return Medication.builder()
                .name(request.getName())
                .id(request.getId())
                .code(request.getCode())
                .weight(request.getWeight())
                .img_url(request.getImg_url()).build();
    }

    /**
     *
     * @param drone - Drone in question
     * @return - current loaded weight on Drone
     */
    public float getTotalLoadedWeight(Drone drone){
        if(drone.getLoadedMeds() == null){
            return 0;
        }
        return drone.getLoadedMeds().stream()
                .map(medId -> medicationRepository.findById(medId)
                        .orElseThrow(() -> new MedicationNotFoundException(medId)))
                .map(Medication::getWeight)
                .reduce(0f, Float::sum);
    }

    public Optional<List<Medication>> getLoadedMeds(String serialNumber){
        Optional<Drone> droneOptional = droneRepository.findById(serialNumber);
        List<Medication> meds = new ArrayList<>();
        if(droneOptional.isPresent()){
            List<String> loadedMedsIds = droneOptional.get().getLoadedMeds();
            for (String loadedMedsId : loadedMedsIds) {
                Optional<Medication> med = medicationRepository.findById(loadedMedsId);
                med.ifPresent(meds::add);

            }
        }

        return Optional.of(meds);
    }

    public Optional<List<Drone>> getIdleDrones() {
        List<Drone> idleDrones = droneRepository.findAll().stream()
                .filter(drone -> drone.getState() == State.IDLE)
                .collect(Collectors.toList());
        return Optional.of(idleDrones);
    }

    public Optional<List<Drone>> getAllDrones(){
        return Optional.of(droneRepository.findAll());
    }

    public int getBatteryLevel(String serialNumber) {
        Optional<Drone> d = droneRepository.findById(serialNumber);
        if (d.isPresent()) {
            return d.get().getBatteryCapacity();
        }
        return 0;
    }

    // 1
    public Optional<List<Drone>> getLoadedDrones() {
        List<Drone> loadedDrones = new ArrayList<>();
        List<Drone> drones = droneRepository.findAll();
        for (Drone drone : drones) {
            if (drone.getState() == State.LOADED) {
                loadedDrones.add(drone);
            }
        }
        return Optional.of(loadedDrones);
    }

    public void sendDroneForDelivery(String serialNumber) {
        Optional<Drone> drone = droneRepository.findById(serialNumber);
        if (drone.isPresent()) {
            Drone dObject = drone.get();
            dObject.setState(State.DELIVERING);
            droneRepository.save(dObject);
        }
    }

    // 2
    public Optional<List<Drone>> getDronesMarkedForDelivery() {
        List<Drone> dronesOutForDelivery = new ArrayList<>();
        List<Drone> drones = droneRepository.findAll();
        for (Drone drone : drones) {
            if (drone.getState() == State.DELIVERING) {
                dronesOutForDelivery.add(drone);
            }
        }
        return Optional.of(dronesOutForDelivery);
    }

    public void deliverDrone(String serialNumber) {
        Optional<Drone> drone = droneRepository.findById(serialNumber);
        if (drone.isPresent()) {
            Drone dObject = drone.get();
            dObject.setState(State.DELIVERED);
            droneRepository.save(dObject);
        }
    }

    // 3
    public Optional<List<Drone>> getDronesMarkedAsDelivered() {
        List<Drone> deliveredDrones = new ArrayList<>();
        List<Drone> drones = droneRepository.findAll();
        for (Drone drone : drones) {
            if (drone.getState() == State.DELIVERED) {
                deliveredDrones.add(drone);
            }
        }
        return Optional.of(deliveredDrones);
    }

    public void returnDrone(String serialNumber) {
        Optional<Drone> drone = droneRepository.findById(serialNumber);

        if (drone.isPresent()) {
            Drone dObject = drone.get();
            dObject.setState(State.RETURNING);
            dObject.setLoadedMeds(new ArrayList<>()); // empty meds
            droneRepository.save(dObject);
        }
    }


    public Optional<List<Drone>> getReturningDrones() {
        List<Drone> deliveredDrones = new ArrayList<>();
        List<Drone> drones = droneRepository.findAll();
        for (Drone drone : drones) {
            if (drone.getState() == State.RETURNING) {
                deliveredDrones.add(drone);
            }
        }
        return Optional.of(deliveredDrones);
    }


    public void markIdle(String serialNumber) {
        Optional<Drone> drone = droneRepository.findById(serialNumber);

        if (drone.isPresent()) {
            Drone dObject = drone.get();
            dObject.setState(State.IDLE);
            // dObject.setLoadedMeds(new ArrayList<>()); // empty meds
            droneRepository.save(dObject);
        }
    }
}
