package drx.drone.service.drone_med_service.controller;


import drx.drone.service.drone_med_service.model.Medication;
import drx.drone.service.drone_med_service.service.MedicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService service;

    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public Optional<List<Medication>> getAllMeds(){
        return service.getAllMedications();
    }
}
