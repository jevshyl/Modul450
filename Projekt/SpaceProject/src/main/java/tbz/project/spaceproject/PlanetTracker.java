package tbz.project.spaceproject;

import java.util.ArrayList;
import java.util.List;

public class PlanetTracker<T extends Explorable> {

    private final List<T> explorers = new ArrayList<>();

    public void add(T explorer) {
        explorers.add(explorer);
    }

    public void showAll() {
        if (explorers.isEmpty()) {
            System.out.println("No planets explored yet.");
        } else {
            System.out.println("Visited planets:");
            explorers.forEach(planet -> System.out.println("-" + planet.getName()));
        }
    }
}
