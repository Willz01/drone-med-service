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
@RequestMapping(path = "api/v1/drones")
@RequiredArgsConstructor
public class DroneController {

    private final DroneService service;

    /**
     *
     * @param drone [weightClass]
     * @return - newly added Drone object
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Optional<Drone> registerDrone(@RequestBody DroneRequest drone){
        return service.registerDrone(drone);
    }

    /**
     *
     * @param serialNumber - Drone's serialNumber[ID]
     * @return - returns looked up drone object
     */
    @GetMapping("/{serialNumber}")
    @ResponseStatus(HttpStatus.OK)
    public Optional<Drone> getDrone(@PathVariable String serialNumber){
        return service.getDroneById(serialNumber);
    }

    /**
     *
     * @param serialNumber - Drone's serialNumber[ID]
     * @param medication - Medication object to be loaded on drone
     *                   - [name, weight, code, img_url]
     * @return           - returns confirmation message
     * @throws Exception - <Exception>DroneOverWeightException</Exception> ,
     *                   - <Exception>DroneNotFoundException</Exception> ,
     *                   - <Exception>MedicationNotFoundException</Exception>
     */
    @PostMapping("/{serialNumber}/loadMeds")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<String> loadDrone(@PathVariable String serialNumber, @RequestBody MedRequest medication) throws Exception {
        service.loadDrone(serialNumber, medication);
        return ResponseEntity.ok("Medication loaded on drone " + serialNumber);
    }

    /**
     *
     * @param serialNumber - Drone's serialNumber[ID]
     * @return - returns <list>medications</list> loaded on Drone(serialNumber)
     */
    @GetMapping("/{serialNumber}/medications")
    @ResponseStatus(HttpStatus.OK)
    public Optional<List<Medication>> getLoadedMeds(@PathVariable("serialNumber") String serialNumber){
        return service.getLoadedMeds(serialNumber);
    }

    /**
     *
     * @return - return list of available drones [State.IDLE]
     */
    @GetMapping("/available")
    @ResponseStatus(HttpStatus.OK)
    public Optional<List<Drone>> getAvailableDrones(){
        // return drones marked as 'available' or 'idle'
        return service.getIdleDrones();
    }

    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public Optional<List<Drone>> getAllDrones(){
        // return all drones
        return service.getAllDrones();
    }

    /**
     *
     * @param serial_number - drone's serialNumber
     * @return - returns drone battery level
     */
    @GetMapping("/{serialNumber}/battery")
    @ResponseStatus(HttpStatus.OK)
    public int getBatteryLevel(@PathVariable String serial_number){
        // return battery level of drone(serial-number)
        return service.getBatteryLevel(serial_number);
    }

    // send (mark) drone for delivery
    // change state from "loaded" to "delivering" (already changes from loading to loaded on weight shift)


    // get all drones out for delivery



}
