package drx.drone.service.drone_med_service.service;

import drx.drone.service.drone_med_service.dto.DroneRequest;
import drx.drone.service.drone_med_service.dto.MedRequest;
import drx.drone.service.drone_med_service.exception.DroneNotExistException;
import drx.drone.service.drone_med_service.exception.DroneOverWeightException;
import drx.drone.service.drone_med_service.exception.MedicationNotFoundException;
import drx.drone.service.drone_med_service.model.Drone;
import drx.drone.service.drone_med_service.model.Medication;
import drx.drone.service.drone_med_service.model.State;
import drx.drone.service.drone_med_service.model.WeightModel;
import drx.drone.service.drone_med_service.repository.DroneRepository;
import drx.drone.service.drone_med_service.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
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

    public void loadDrone(String serialNumber, MedRequest medRequest) throws Exception {
        // use serial-number to find drone
        // handle weight limit
        // (yes)
        // save med to medications table
        // save item(med-code) to drone loadedMeds list
        // update drone (weight, state, medList)
        // (no)
        // cant save

        Optional<Drone> optionalDrone = droneRepository.findById(serialNumber);
        if(optionalDrone.isPresent()){

            Drone drone = optionalDrone.get();
            if (drone.getBatteryCapacity() >= 25){
                float medWeight = medRequest.getWeight();
                float droneWeight = drone.getWeightLimit(); // 500 constant? or depending on drone's weight class

                float totalLoadedWeight = getTotalLoadedWeight(drone);

                if(medWeight + totalLoadedWeight <= droneWeight){
                    Medication medication = buildMedication(medRequest);
                    medicationRepository.save(medication);

                    String medID = medication.getId();


                    drone.getLoadedMeds().add(medID);  // add medication ID
                    drone.setState(State.LOADING);     // update drone state
                    drone.setBatteryCapacity(drone.getBatteryCapacity() - 15);  // reduce battery level

                    droneRepository.save(drone);  // save updates

                }else{
                    drone.setState(State.LOADED);
                    throw new DroneOverWeightException();
                }
            }else{
                drone.setState(State.LOADED); // system charge ?????
                throw new Exception("Battery level below 25%");
            }

        }else{
            throw new DroneNotExistException(serialNumber);
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

    public int getBatteryLevel(String serialNumber){
       Optional<Drone> d = droneRepository.findById(serialNumber);
       if (d.isPresent()){
           return d.get().getBatteryCapacity();
       }
       return 0;
    }
}
