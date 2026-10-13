package tbz.project.spaceproject;
import tbz.project.spaceproject.DTO.PlanetApiDTO;

public class PlanetFactory {

    public static Planet createFromApi(PlanetApiDTO dto) {

        // Various numbers about the Planets
        double gravity = dto.getGravity() != null ? dto.getGravity() : 0.0;
        double temperature = dto.getAvgTemp() != null ? dto.getAvgTemp() : 0.0;
        double mass = 0.0;
        if (dto.getMass() != null) {
            mass = dto.getMass().getMassValue()
                   * Math.pow(10, dto.getMass().getMassExponent());
        }

        double volume = 0.0;
        if (dto.getVol() != null) {
            volume = dto.getVol().getVolValue()
                     * Math.pow(10, dto.getVol().getVolExponent());
        }

        return new Planet(
                dto.getId(),
                dto.getEnglishName(),
                gravity,
                temperature,
                mass,
                volume,
                dto.getDiscoveryDate(),
                dto.getDiscoveredBy()
        );
    }
}
