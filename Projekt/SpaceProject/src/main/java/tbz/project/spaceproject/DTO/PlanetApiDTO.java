package tbz.project.spaceproject.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PlanetApiDTO {

    // Planet Info Attributes
    private String id;
    private String englishName;
    private Double gravity;
    private Double avgTemp;
    private MassDTO mass;
    private VolumeDTO vol;
    private String discoveryDate;
    private String discoveredBy;

}

