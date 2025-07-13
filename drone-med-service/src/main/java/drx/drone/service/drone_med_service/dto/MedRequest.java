package drx.drone.service.drone_med_service.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class MedRequest {

    public String id;
    public String name;
    public float weight;
    public String code;
    public String img_url;
}
