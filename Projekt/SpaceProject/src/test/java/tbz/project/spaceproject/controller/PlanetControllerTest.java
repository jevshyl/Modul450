package tbz.project.spaceproject.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tbz.project.spaceproject.DTO.PlanetResponse;
import tbz.project.spaceproject.service.PlanetCatalogService;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PlanetController.class)
class PlanetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PlanetCatalogService planetCatalogService;

    private static PlanetResponse mars() {
        return PlanetResponse.builder()
                .id("mars")
                .routeId("mars")
                .name("Mars")
                .gravity(3.71)
                .temperatureKelvin(210)
                .temperatureCelsius(-63.15)
                .mass(6.39e23)
                .volume(1.63e11)
                .discoveryDate("")
                .discoveredBy("")
                .explorable(false)
                .notExplorableReason("Gravity too high → you would be crushed!")
                .aircraft("350")
                .info("Planet Mars")
                .build();
    }

    @Test
    @DisplayName("GET /api/planets returns the whole catalogue")
    void listsAllPlanets() throws Exception {
        when(planetCatalogService.getAllPlanets()).thenReturn(List.of(mars()));

        mockMvc.perform(get("/api/planets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].routeId").value("mars"))
                .andExpect(jsonPath("$[0].name").value("Mars"))
                .andExpect(jsonPath("$[0].explorable").value(false));
    }

    @Test
    void returnsAnEmptyArrayWhenNoPlanetsAreAvailable() throws Exception {
        when(planetCatalogService.getAllPlanets()).thenReturn(List.of());

        mockMvc.perform(get("/api/planets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("GET /api/planets/{routeId} returns telemetry for a known body")
    void returnsPlanetByRouteId() throws Exception {
        when(planetCatalogService.getPlanetById("mars")).thenReturn(Optional.of(mars()));

        mockMvc.perform(get("/api/planets/mars"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.routeId").value("mars"))
                .andExpect(jsonPath("$.gravity").value(3.71))
                .andExpect(jsonPath("$.aircraft").value("350"))
                .andExpect(jsonPath("$.notExplorableReason").value("Gravity too high → you would be crushed!"));
    }

    @Test
    void returnsNotFoundForAnUnresolvableRoute() throws Exception {
        when(planetCatalogService.getPlanetById("krypton")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/planets/krypton"))
                .andExpect(status().isNotFound());
    }
}
