package tbz.project.spaceproject.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tbz.project.spaceproject.DTO.DestinationResponse;
import tbz.project.spaceproject.DTO.PlanetResponse;
import tbz.project.spaceproject.Exception.PlanetApiException;
import tbz.project.spaceproject.Planet;
import tbz.project.spaceproject.PlanetAPIService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlanetCatalogServiceTest {

    @Mock
    private PlanetAPIService planetAPIService;

    private PlanetCatalogService service;

    private static Planet mars() {
        return new Planet("mars", "Mars", 3.71, 210, 6.39e23, 1.63e11, "", "");
    }

    @BeforeEach
    void setUp() {
        service = new PlanetCatalogService(planetAPIService);
    }

    @Test
    void exposesEveryFlightPlanDestination() {
        List<DestinationResponse> destinations = service.getDestinations();

        assertThat(destinations).hasSize(7);
        assertThat(destinations.getFirst())
                .extracting(DestinationResponse::getName, DestinationResponse::getMenuNumber,
                        DestinationResponse::getPlanetId, DestinationResponse::getAircraft)
                .containsExactly("MARS", 1, "mars", "350");
    }

    @Test
    @DisplayName("resolves a body by route id and stamps the flight-plan routeId")
    void resolvesPlanetByRouteId() {
        when(planetAPIService.getPlanet("mars")).thenReturn(mars());

        Optional<PlanetResponse> result = service.getPlanetById("mars");

        assertThat(result).isPresent();
        assertThat(result.get().getRouteId()).isEqualTo("mars");
        assertThat(result.get().getName()).isEqualTo("Mars");
    }

    @Test
    void routeIdLookupIsCaseInsensitive() {
        when(planetAPIService.getPlanet("mars")).thenReturn(mars());

        assertThat(service.getPlanetById("MARS")).isPresent();
    }

    @Test
    void returnsEmptyForUnknownRouteId() {
        assertThat(service.getPlanetById("krypton")).isEmpty();
        verify(planetAPIService, never()).getPlanet(anyString());
    }

    @Test
    void returnsEmptyForBlankOrNullRouteId() {
        assertThat(service.getPlanetById("  ")).isEmpty();
        assertThat(service.getPlanetById(null)).isEmpty();
        verify(planetAPIService, never()).getPlanet(anyString());
    }

    @Test
    void resolvesPlanetByMenuNumber() {
        when(planetAPIService.getPlanet("venus")).thenReturn(mars());

        Optional<PlanetResponse> result = service.getPlanetByMenuNumber(2);

        assertThat(result).isPresent();
        assertThat(result.get().getRouteId()).isEqualTo("venus");
    }

    @Test
    void returnsEmptyForUnknownMenuNumber() {
        assertThat(service.getPlanetByMenuNumber(99)).isEmpty();
    }

    @Test
    @DisplayName("a single failing body never fails the whole catalogue")
    void getAllPlanetsIsolatesUpstreamFailures() {
        // doReturn/doThrow avoid invoking the mock while stubbing, because the
        // broad anyString() stub below would otherwise throw immediately.
        doThrow(new PlanetApiException("boom")).when(planetAPIService).getPlanet(anyString());
        doReturn(mars()).when(planetAPIService).getPlanet("mars");

        List<PlanetResponse> planets = service.getAllPlanets();

        assertThat(planets).hasSize(1);
        assertThat(planets.getFirst().getRouteId()).isEqualTo("mars");
    }

    @Test
    void cachesRepeatedLookupsWithinTheTtl() {
        when(planetAPIService.getPlanet("mars")).thenReturn(mars());

        service.getPlanetById("mars");
        service.getPlanetById("mars");

        verify(planetAPIService, times(1)).getPlanet("mars");
    }

    @Test
    void clearCacheForcesAReload() {
        when(planetAPIService.getPlanet("mars")).thenReturn(mars());

        service.getPlanetById("mars");
        service.clearCache();
        service.getPlanetById("mars");

        verify(planetAPIService, times(2)).getPlanet("mars");
    }

    @Test
    @DisplayName("an expired cache entry is reloaded from the upstream API")
    void reloadsExpiredCacheEntries() throws Exception {
        when(planetAPIService.getPlanet("mars")).thenReturn(mars());

        // Prime the cache normally.
        service.getPlanetById("mars");

        // Swap in an entry created at the epoch so its TTL has already elapsed.
        Class<?> cacheEntryType = Class.forName(
                "tbz.project.spaceproject.service.PlanetCatalogService$CacheEntry");
        var constructor = cacheEntryType.getDeclaredConstructor(Planet.class, long.class);
        constructor.setAccessible(true);
        Object expiredEntry = constructor.newInstance(mars(), 0L);

        var cacheField = PlanetCatalogService.class.getDeclaredField("cache");
        cacheField.setAccessible(true);
        @SuppressWarnings("unchecked")
        Map<String, Object> cache = (Map<String, Object>) cacheField.get(service);
        cache.put("mars", expiredEntry);

        service.getPlanetById("mars");

        verify(planetAPIService, times(2)).getPlanet("mars");
    }

    @Test
    void knownDestinationReflectsFlightPlan() {
        assertThat(service.isKnownDestination("saturn")).isTrue();
        assertThat(service.isKnownDestination("krypton")).isFalse();
        verifyNoMoreInteractions(planetAPIService);
    }
}
