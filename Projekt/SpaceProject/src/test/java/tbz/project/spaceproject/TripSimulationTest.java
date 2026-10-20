package tbz.project.spaceproject;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class TripSimulationTest {

    private final InputStream originalIn = System.in;

    @AfterEach
    void restoreSystemIn() {
        System.setIn(originalIn);
        Thread.interrupted();
    }

    private void input(String data) {
        System.setIn(new ByteArrayInputStream(data.getBytes()));
    }

    static class RecordingTripSimulation extends TripSimulation {
        final List<String> calls = new ArrayList<>();
        final List<Long> sleeps = new ArrayList<>();

        @Override
        protected void chooseDestination() {
            calls.add("chooseDestination");
        }

        @Override
        protected void explorePlanet() {
            calls.add("explorePlanet");
        }

        @Override
        protected void sleep(long millis) {
            sleeps.add(millis);
        }
    }

    static class PlainTripSimulation extends TripSimulation {
        @Override
        protected void chooseDestination() {
        }

        @Override
        protected void explorePlanet() {
        }
    }

    @Test
    void runTripFollowsTheTemplateOrder() {
        input("n\ny\n");
        RecordingTripSimulation trip = new RecordingTripSimulation();

        trip.runTrip();

        assertThat(trip.calls).containsExactly("chooseDestination", "explorePlanet");
        assertThat(trip.sleeps).contains(1000L, 3000L, 500L);
    }

    @Test
    void sleepReinterruptsTheThreadWhenInterrupted() {
        input("y\n");
        PlainTripSimulation trip = new PlainTripSimulation();

        trip.sleep(0);
        assertThat(Thread.interrupted()).isFalse();

        Thread.currentThread().interrupt();
        trip.sleep(1);

        assertThat(Thread.interrupted()).isTrue();
    }
}
