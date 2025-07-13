package drx.drone.service.drone_med_service.repository;

import drx.drone.service.drone_med_service.model.Drone;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DroneRepository extends MongoRepository<Drone, String> {
}
