package drx.drone.service.drone_med_service.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(value = "medications")
@Builder
@Data
@AllArgsConstructor
public class Medication {

    @Id
    @Generated
    public String id;
    public String name;
    public float weight;
    public String code;
    public String img_url;
}
