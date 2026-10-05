package tbz.project.spaceproject.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tbz.project.spaceproject.DTO.DestinationResponse;
import tbz.project.spaceproject.DTO.PlanetResponse;
import tbz.project.spaceproject.service.PlanetCatalogService;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final PlanetCatalogService planetCatalogService;

    public DestinationController(PlanetCatalogService planetCatalogService) {
        this.planetCatalogService = planetCatalogService;
    }

    @GetMapping
    public List<DestinationResponse> getDestinations() {
        return planetCatalogService.getDestinations();
    }

    @GetMapping("/{menuNumber}")
    public ResponseEntity<PlanetResponse> getDestination(@PathVariable int menuNumber) {
        return planetCatalogService.getPlanetByMenuNumber(menuNumber)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/cache/clear")
    public ResponseEntity<Void> clearCache() {
        planetCatalogService.clearCache();
        return ResponseEntity.noContent().build();
    }
}
