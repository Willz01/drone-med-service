package drx.drone.service.drone_med_service.repository;

import drx.drone.service.drone_med_service.model.Medication;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MedicationRepository extends MongoRepository<Medication, String> {
}
