package tbz.project.spaceproject;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

class PlanetTest {

    private static Planet planet(double gravity, double temperature) {
        return new Planet("test", "Test World", gravity, temperature, 1.0, 1.0, null, null);
    }

    @Nested
    @DisplayName("Explorability")
    class Explorability {

        @Test
        void isExplorableWhenWithinSuitTolerance() {
            Planet earth = planet(1.0, 288);

            assertThat(earth.isExplorable()).isTrue();
            assertThat(earth.getNotExplorableReason()).isEmpty();
        }

        @Test
        void rejectsTemperatureBelowSurvivableRange() {
            Planet cold = planet(1.0, 50);

            assertThat(cold.isExplorable()).isFalse();
            assertThat(cold.getNotExplorableReason()).isEqualTo("Temperature too low even for a suit!");
        }

        @Test
        void rejectsTemperatureAboveSurvivableRange() {
            Planet hot = planet(1.0, 600);

            assertThat(hot.isExplorable()).isFalse();
            assertThat(hot.getNotExplorableReason()).isEqualTo("Temperature too high even for a suit!");
        }

        @Test
        void rejectsGravityTooLow() {
            Planet light = planet(0.05, 288);

            assertThat(light.isExplorable()).isFalse();
            assertThat(light.getNotExplorableReason()).isEqualTo("Gravity too low → you cannot stand!");
        }

        @Test
        void rejectsGravityTooHighIndependentlyOfTemperature() {
            Planet heavy = planet(9.8, 288);

            assertThat(heavy.isExplorable()).isFalse();
            assertThat(heavy.getNotExplorableReason()).isEqualTo("Gravity too high → you would be crushed!");
        }

        @Test
        void gravityIsEvaluatedEvenWhenTemperatureIsAlsoOutOfRange() {
            Planet hostile = planet(9.8, 50);

            assertThat(hostile.isExplorable()).isFalse();
            assertThat(hostile.getNotExplorableReason()).isEqualTo("Temperature too low even for a suit!");
        }

        @ParameterizedTest(name = "gravity {0} m/s² at 288 K is explorable")
        @CsvSource({"0.1", "1.0", "3.0"})
        void acceptsInclusiveGravityBounds(double gravity) {
            assertThat(planet(gravity, 288).isExplorable()).isTrue();
        }

        @ParameterizedTest(name = "temperature {0} K at 1 m/s² is explorable")
        @CsvSource({"100", "288", "500"})
        void acceptsInclusiveTemperatureBounds(double temperature) {
            assertThat(planet(1.0, temperature).isExplorable()).isTrue();
        }
    }

    @Nested
    @DisplayName("Formatting")
    class Formatting {

        @Test
        void convertsKelvinToCelsius() {
            assertThat(planet(1.0, 273.15).getTemperatureInCelsius()).isCloseTo(0.0, org.assertj.core.data.Offset.offset(1e-9));
        }

        @Test
        void exploreReturnsSuccessMessageWhenExplorable() {
            assertThat(planet(1.0, 288).explore()).isEqualTo("Exploring planet Test World!");
        }

        @Test
        void exploreExplainsRefusalWhenNotExplorable() {
            assertThat(planet(9.8, 288).explore())
                    .isEqualTo("Cannot explore Test World: Gravity too high → you would be crushed!");
        }

        @Test
        void infoIncludesCoreTelemetry() {
            String info = new Planet("mars", "Mars", 3.71, 210, 6.39e23, 1.63e11, null, null).getInfo();

            assertThat(info)
                    .contains("Planet Mars")
                    .contains("ID: mars")
                    .contains("Gravity: 3.71 m/s²")
                    .contains("-63.15 °C");
        }

        @Test
        void infoAppendsDiscoveryDetailsWhenPresent() {
            String info = new Planet("terra", "Terra Nova", 1.0, 288, 5.97e24, 1.08e12,
                    "2287", "Deep Field Survey").getInfo();

            assertThat(info)
                    .contains("\nDiscovered By: Deep Field Survey")
                    .contains("\nDiscovery Date: 2287");
        }

        @Test
        void infoOmitsBlankDiscoveryDetails() {
            String info = new Planet("void", "Void", 1.0, 288, 1.0, 1.0, "   ", "   ").getInfo();

            assertThat(info)
                    .doesNotContain("Discovered By")
                    .doesNotContain("Discovery Date");
        }
    }
}
