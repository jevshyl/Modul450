package tbz.project.spaceproject.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tbz.project.spaceproject.DTO.DestinationResponse;
import tbz.project.spaceproject.DTO.PlanetResponse;
import tbz.project.spaceproject.service.PlanetCatalogService;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DestinationController.class)
class DestinationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PlanetCatalogService planetCatalogService;

    private static PlanetResponse moon() {
        return PlanetResponse.builder()
                .id("lune")
                .routeId("moon")
                .name("Moon")
                .gravity(1.62)
                .temperatureKelvin(250)
                .temperatureCelsius(-23.15)
                .mass(7.35e22)
                .volume(2.2e10)
                .explorable(true)
                .notExplorableReason("")
                .aircraft("101")
                .info("Planet Moon")
                .build();
    }

    @Test
    @DisplayName("GET /api/destinations lists the flight plan")
    void listsDestinations() throws Exception {
        when(planetCatalogService.getDestinations()).thenReturn(List.of(
                DestinationResponse.of("MARS", 1, "mars", "350"),
                DestinationResponse.of("MOON", 3, "moon", "101")));

        mockMvc.perform(get("/api/destinations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("MARS"))
                .andExpect(jsonPath("$[0].menuNumber").value(1))
                .andExpect(jsonPath("$[0].planetId").value("mars"))
                .andExpect(jsonPath("$[1].aircraft").value("101"));
    }

    @Test
    @DisplayName("GET /api/destinations/{menuNumber} resolves the destination planet")
    void returnsDestinationByMenuNumber() throws Exception {
        when(planetCatalogService.getPlanetByMenuNumber(3)).thenReturn(Optional.of(moon()));

        mockMvc.perform(get("/api/destinations/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.routeId").value("moon"))
                .andExpect(jsonPath("$.explorable").value(true));
    }

    @Test
    void returnsNotFoundForAnUnknownMenuNumber() throws Exception {
        when(planetCatalogService.getPlanetByMenuNumber(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/destinations/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/destinations/cache/clear empties the cache and returns 204")
    void clearsTheCache() throws Exception {
        mockMvc.perform(post("/api/destinations/cache/clear"))
                .andExpect(status().isNoContent());

        verify(planetCatalogService).clearCache();
    }
}
