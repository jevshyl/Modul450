package tbz.project.spaceproject;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class SimulationRunnerTest {

    private final InputStream originalIn = System.in;

    @AfterEach
    void restoreSystemIn() {
        System.setIn(originalIn);
    }

    private void input(String data) {
        System.setIn(new ByteArrayInputStream(data.getBytes()));
    }

    @Test
    void keepsRunningTripsUntilThePlayerAnswersNo() {
        Simulation simulation = mock(Simulation.class);
        SimulationRunner runner = new SimulationRunner(simulation);
        runner.setExitHandler(status -> { });
        input("x\ny\nn\n");

        runner.run();

        verify(simulation, times(2)).runTrip();
    }

    @Test
    void asksAgainOnInvalidInputAndStopsOnNo() {
        Simulation simulation = mock(Simulation.class);
        SimulationRunner runner = new SimulationRunner(simulation);
        List<Integer> exitStatuses = new ArrayList<>();
        runner.setExitHandler(exitStatuses::add);
        input("maybe\nn\n");

        runner.run();

        verify(simulation).runTrip();
        assertThat(exitStatuses).containsExactly(0);
    }
}
