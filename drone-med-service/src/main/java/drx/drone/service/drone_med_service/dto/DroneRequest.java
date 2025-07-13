package drx.drone.service.drone_med_service.dto;

import drx.drone.service.drone_med_service.model.State;
import drx.drone.service.drone_med_service.model.WeightModel;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class DroneRequest {

    public String serialNumber;
    public WeightModel weightClass;
    public float weightLimit;
    public Integer batteryCapacity;
    public State state;
    public List<String> loadedMeds; // medication codes or UUIDs
}
