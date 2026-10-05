package tbz.project.spaceproject.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tbz.project.spaceproject.DTO.PlanetResponse;
import tbz.project.spaceproject.service.PlanetCatalogService;

import java.util.List;

@RestController
@RequestMapping("/api/planets")
public class PlanetController {

    private final PlanetCatalogService planetCatalogService;

    public PlanetController(PlanetCatalogService planetCatalogService) {
        this.planetCatalogService = planetCatalogService;
    }

    @GetMapping
    public List<PlanetResponse> getAllPlanets() {
        return planetCatalogService.getAllPlanets();
    }

    @GetMapping("/{planetId}")
    public ResponseEntity<PlanetResponse> getPlanet(@PathVariable String planetId) {
        return planetCatalogService.getPlanetById(planetId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
