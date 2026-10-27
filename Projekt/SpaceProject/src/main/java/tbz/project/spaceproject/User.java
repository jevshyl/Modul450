package tbz.project.spaceproject;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String username;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_explored_planets", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "planet")
    private List<String> exploredPlanets = new ArrayList<>();

    @Builder
    public User(UUID id, String username, List<String> exploredPlanets) {
        this.id = id;
        this.username = username;
        if (exploredPlanets != null) exploredPlanets.forEach(this::explorePlanet);
    }

    public User(UUID id, String username) {
        this(id, username, null);
    }

    public void explorePlanet(String planet) {
        if (planet != null && !exploredPlanets.contains(planet)) {
            exploredPlanets.add(planet);
        }
    }
}