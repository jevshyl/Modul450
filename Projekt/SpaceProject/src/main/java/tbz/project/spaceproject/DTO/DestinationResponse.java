package tbz.project.spaceproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DestinationResponse {

    private final int menuNumber;
    private final String name;
    private final String planetId;
    private final String aircraft;

    public static DestinationResponse of(String name, int menuNumber, String planetId, String aircraft) {
        return DestinationResponse.builder()
                .name(name)
                .menuNumber(menuNumber)
                .planetId(planetId)
                .aircraft(aircraft)
                .build();
    }
}
