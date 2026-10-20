package tbz.project.spaceproject;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PlanetFactoryTest {

    @Test
    void canBeInstantiated() {
        assertThat(new PlanetFactory()).isNotNull();
    }
}
