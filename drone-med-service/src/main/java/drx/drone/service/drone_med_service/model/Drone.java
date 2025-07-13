package drx.drone.service.drone_med_service.model;


import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(value = "drones")
@Builder
@Data
@AllArgsConstructor
public class Drone {

    @Id
    @Generated
    public String serialNumber;
    public WeightModel weightClass;
    public float weightLimit;
    public Integer batteryCapacity;
    public State state;
    @Builder.Default
    public List<String> loadedMeds = new ArrayList<>(); // medication codes or UUIDs


    @PostConstruct
    private void init() {
        if (loadedMeds == null) {
            loadedMeds = new ArrayList<>();
        }
    }

}
