package tbz.project.spaceproject;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import tbz.project.spaceproject.Exception.PlanetApiException;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SimulationTest {

    private final InputStream originalIn = System.in;
    private final PlanetAPIService planetAPIService = mock(PlanetAPIService.class);

    @AfterEach
    void restoreSystemIn() {
        System.setIn(originalIn);
    }

    private void input(String data) {
        System.setIn(new ByteArrayInputStream(data.getBytes()));
    }

    private Simulation silentSimulation() {
        return new Simulation(planetAPIService) {
            @Override
            protected void sleep(long millis) {
                // no delay in tests
            }
        };
    }

    private static Planet planet(String id, String name, double gravity, double temperature) {
        return new Planet(id, name, gravity, temperature, 0, 0, "", "");
    }

    @Test
    void boardsTheAircraftAndStoresTheDestination() {
        input("1\n");
        when(planetAPIService.getPlanet("mars")).thenReturn(planet("mars", "Mars", 1.0, 300));

        silentSimulation().chooseDestination();

        verify(planetAPIService).getPlanet("mars");
    }

    @Test
    void retriesAfterANonNumericChoice() {
        input("not-a-number\n1\n");
        when(planetAPIService.getPlanet("mars")).thenReturn(planet("mars", "Mars", 1.0, 300));

        silentSimulation().chooseDestination();

        verify(planetAPIService).getPlanet("mars");
    }

    @Test
    void showsVisitedPlanetsThenAcceptsAChoice() {
        input("8\n1\n");
        when(planetAPIService.getPlanet("mars")).thenReturn(planet("mars", "Mars", 1.0, 300));

        silentSimulation().chooseDestination();

        verify(planetAPIService).getPlanet("mars");
    }

    @Test
    void retriesAfterAnUnknownDestination() {
        input("99\n1\n");
        when(planetAPIService.getPlanet("mars")).thenReturn(planet("mars", "Mars", 1.0, 300));

        silentSimulation().chooseDestination();

        verify(planetAPIService).getPlanet("mars");
    }

    @Test
    void wrapsUpstreamFailures() {
        input("1\n");
        when(planetAPIService.getPlanet("mars")).thenThrow(new PlanetApiException("mars"));

        assertThatThrownBy(() -> silentSimulation().chooseDestination())
                .isInstanceOf(PlanetApiException.class)
                .hasMessage("Planet API is unavailable");
    }

    @Test
    void doesNothingWhenNoPlanetWasChosen() {
        assertThatCode(() -> silentSimulation().explorePlanet()).doesNotThrowAnyException();
    }

    @Test
    void describesAnExplorablePlanet() {
        Simulation simulation = silentSimulation();
        ReflectionTestUtils.setField(simulation, "currentPlanet", planet("kepler", "Kepler", 1.0, 300));

        simulation.explorePlanet();
    }

    @Test
    void explainsWhyAPlanetIsNotExplorable() {
        Simulation simulation = silentSimulation();
        ReflectionTestUtils.setField(simulation, "currentPlanet", planet("frozen", "Frozen", 1.0, 10));

        simulation.explorePlanet();
    }
}
