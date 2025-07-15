package drx.drone.service.drone_med_service.service;

import drx.drone.service.drone_med_service.model.Medication;
import drx.drone.service.drone_med_service.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MedicationService {
    private final MedicationRepository repository;

    public Optional<List<Medication>> getAllMedications(){
        return Optional.of(repository.findAll());
    }
}
