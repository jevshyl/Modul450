package tbz.project.spaceproject.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import tbz.project.spaceproject.Destination;
import tbz.project.spaceproject.DTO.DestinationResponse;
import tbz.project.spaceproject.DTO.PlanetResponse;
import tbz.project.spaceproject.Exception.PlanetApiException;
import tbz.project.spaceproject.Planet;
import tbz.project.spaceproject.PlanetAPIService;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PlanetCatalogService {

    private static final Duration CACHE_TTL = Duration.ofMinutes(30);
    private static final Logger log = LoggerFactory.getLogger(PlanetCatalogService.class);

    private final PlanetAPIService planetAPIService;
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public PlanetCatalogService(PlanetAPIService planetAPIService) {
        this.planetAPIService = planetAPIService;
    }

    public List<DestinationResponse> getDestinations() {
        return Arrays.stream(Destination.values())
                .map(d -> DestinationResponse.of(
                        d.name(),
                        d.getMenuNumber(),
                        d.getPlanetId(),
                        d.getAircraft()
                ))
                .toList();
    }

    public List<PlanetResponse> getAllPlanets() {
        List<PlanetResponse> planets = new ArrayList<>();
        for (Destination destination : Destination.values()) {
            findPlanet(destination.getPlanetId())
                    .map(planet -> PlanetResponse.from(
                            planet,
                            destination.getPlanetId(),
                            destination.getAircraft()))
                    .ifPresent(planets::add);
        }
        return planets;
    }

    /**
     * Resolves a body by route id. Route ids are always the flight-plan key
     * (Destination#getPlanetId), because the upstream API answers with its own
     * internal ids ("lune", "saturne") which it does not accept back as input.
     */
    public Optional<PlanetResponse> getPlanetById(String routeId) {
        if (routeId == null || routeId.isBlank()) {
            return Optional.empty();
        }

        return findDestination(routeId)
                .flatMap(destination -> findPlanet(destination.getPlanetId())
                        .map(planet -> PlanetResponse.from(
                                planet,
                                destination.getPlanetId(),
                                destination.getAircraft())));
    }

    public Optional<PlanetResponse> getPlanetByMenuNumber(int menuNumber) {
        return Optional.ofNullable(Destination.fromMenuNumber(menuNumber))
                .map(Destination::getPlanetId)
                .flatMap(this::getPlanetById);
    }

    public boolean isKnownDestination(String planetId) {
        return findDestination(planetId).isPresent();
    }

    /**
     * Loads a planet, returning empty when the upstream API cannot serve it so a
     * single unavailable body never fails the whole catalogue.
     */
    private Optional<Planet> findPlanet(String planetId) {
        try {
            return Optional.of(loadPlanet(planetId));
        } catch (PlanetApiException e) {
            log.warn("Skipping body '{}': {}", planetId, e.getMessage());
            return Optional.empty();
        }
    }

    private Planet loadPlanet(String planetId) {
        CacheEntry cached = cache.get(planetId);
        if (cached != null && !cached.isExpired()) {
            return cached.planet();
        }

        Planet planet = planetAPIService.getPlanet(planetId);
        cache.put(planetId, new CacheEntry(planet, System.currentTimeMillis()));
        return planet;
    }

    private Optional<Destination> findDestination(String planetId) {
        return Arrays.stream(Destination.values())
                .filter(d -> d.getPlanetId().equalsIgnoreCase(planetId))
                .findFirst();
    }

    public void clearCache() {
        cache.clear();
    }

    private record CacheEntry(Planet planet, long createdAt) {
        boolean isExpired() {
            return System.currentTimeMillis() - createdAt > CACHE_TTL.toMillis();
        }
    }
}
