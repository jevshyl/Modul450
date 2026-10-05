package tbz.project.spaceproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import tbz.project.spaceproject.Planet;

@Getter
@Builder
@AllArgsConstructor
public class PlanetResponse {

    private final String id;
    private final String routeId;
    private final String name;
    private final double gravity;
    private final double temperatureKelvin;
    private final double temperatureCelsius;
    private final double mass;
    private final double volume;
    private final String discoveryDate;
    private final String discoveredBy;
    private final boolean explorable;
    private final String notExplorableReason;
    private final String aircraft;
    private final String info;

    public static PlanetResponse from(Planet planet, String routeId, String aircraft) {
        return PlanetResponse.builder()
                .id(planet.getId())
                .routeId(routeId)
                .name(planet.getName())
                .gravity(planet.getGravity())
                .temperatureKelvin(planet.getTemperature())
                .temperatureCelsius(planet.getTemperatureInCelsius())
                .mass(planet.getMass())
                .volume(planet.getVol())
                .discoveryDate(planet.getDiscoveryDate())
                .discoveredBy(planet.getDiscoveredBy())
                .explorable(planet.isExplorable())
                .notExplorableReason(planet.getNotExplorableReason())
                .aircraft(aircraft)
                .info(planet.getInfo())
                .build();
    }
}
