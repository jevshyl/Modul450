package tbz.project.spaceproject;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PlanetTrackerTest {

    private final PrintStream originalOut = System.out;

    @AfterEach
    void restoreSystemOut() {
        System.setOut(originalOut);
    }

    private ByteArrayOutputStream captureStdout() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));
        return out;
    }

    @Test
    void reportsWhenNoPlanetsWereVisited() {
        ByteArrayOutputStream out = captureStdout();

        new PlanetTracker<Planet>().showAll();

        assertThat(out.toString()).contains("No planets explored yet.");
    }

    @Test
    void listsEveryVisitedPlanet() {
        Planet planet = mock(Planet.class);
        when(planet.getName()).thenReturn("Mars");
        PlanetTracker<Planet> tracker = new PlanetTracker<>();
        tracker.add(planet);

        ByteArrayOutputStream out = captureStdout();
        tracker.showAll();

        assertThat(out.toString()).contains("Visited planets:", "-Mars");
    }
}
