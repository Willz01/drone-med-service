package drx.drone.service.drone_med_service.controller;


import drx.drone.service.drone_med_service.dto.DroneRequest;
import drx.drone.service.drone_med_service.dto.MedRequest;
import drx.drone.service.drone_med_service.model.Drone;
import drx.drone.service.drone_med_service.model.Medication;
import drx.drone.service.drone_med_service.service.DroneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/drone")
@RequiredArgsConstructor
public class DroneController {

    private final DroneService service;

    /**
     *
     * @param drone [weightClass, weightLimit, batteryCapacity, state]
     * @return - newly added drone
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Optional<Drone> registerDrone(@RequestBody DroneRequest drone){
        return service.registerDrone(drone);
    }


    @GetMapping("/{serialNumber}")
    @ResponseStatus(HttpStatus.OK)
    public Optional<Drone> getDrone(@PathVariable String serialNumber){
        return service.getDroneById(serialNumber);
    }

    // load drone with medication
    @PostMapping("/{serialNumber}/loadMeds")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<String> loadDrone(@PathVariable String serialNumber, @RequestBody MedRequest medication) throws Exception {
        service.loadDrone(serialNumber, medication);
        return ResponseEntity.ok("Medication loaded on drone " + serialNumber);
    }

    // check loaded items
    @GetMapping("/{serialNumber}/medications")
    @ResponseStatus(HttpStatus.OK)
    public Optional<List<Medication>> getLoadedMeds(@PathVariable("serialNumber") String serialNumber){

        // get drone with serial-number
        // get drone loadedMeds ids
        // get saved meds from meds table using loadedMedsIds
        // return list of meds

        return service.getLoadedMeds(serialNumber);
    }

    // checking avai drones for loading
    @GetMapping("/available")
    @ResponseStatus(HttpStatus.OK)
    public Optional<List<Drone>> getAvailableDrones(){
        // return drones marked as 'available' or 'idle'
        return service.getIdleDrones();
    }

    @GetMapping("/{serialNumber}/battery")
    @ResponseStatus(HttpStatus.OK)
    public int getBatteryLevel(@PathVariable String serial_number){
        // return battery level of drone(serial-number)
        return service.getBatteryLevel(serial_number);
    }

}
