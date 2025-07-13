package drx.drone.service.drone_med_service.service;

import drx.drone.service.drone_med_service.dto.DroneRequest;
import drx.drone.service.drone_med_service.dto.MedRequest;
import drx.drone.service.drone_med_service.exception.DroneNotExistException;
import drx.drone.service.drone_med_service.exception.DroneOverWeightException;
import drx.drone.service.drone_med_service.exception.MedicationNotFoundException;
import drx.drone.service.drone_med_service.model.Drone;
import drx.drone.service.drone_med_service.model.Medication;
import drx.drone.service.drone_med_service.model.State;
import drx.drone.service.drone_med_service.repository.DroneRepository;
import drx.drone.service.drone_med_service.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;
import java.util.OptionalInt;

@Service
@RequiredArgsConstructor
public class DroneService {

    private final DroneRepository droneRepository;
    private final MedicationRepository medicationRepository;

    public Optional<Drone> registerDrone(DroneRequest droneRequest){
        Drone drone = Drone.builder()
                .serialNumber(droneRequest.getSerialNumber())
                .batteryCapacity(droneRequest.getBatteryCapacity())
                .weightClass(droneRequest.getWeightClass())
                .weightLimit(droneRequest.getWeightLimit())
                .state(droneRequest.getState())
                .loadedMeds(new ArrayList<>())
                .build();
        droneRepository.save(drone);
        return Optional.of(drone);
    }

    public Optional<Drone> getDroneById(String serialNumber){
        return droneRepository.findById(serialNumber);
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
            float medWeight = medRequest.getWeight();
            float droneWeight = drone.getWeightLimit(); // 500 constant?

            float totalLoadedWeight = getTotalLoadedWeight(drone);

            if(medWeight + totalLoadedWeight <= droneWeight){
                Medication medication = buildMedication(medRequest);
                medicationRepository.save(medication);

                String medID = medication.getId();


                drone.getLoadedMeds().add(medID);
                drone.setState(State.LOADED);

                droneRepository.save(drone);

            }else{
                // create custom exceptions
                throw new DroneOverWeightException();
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
}
