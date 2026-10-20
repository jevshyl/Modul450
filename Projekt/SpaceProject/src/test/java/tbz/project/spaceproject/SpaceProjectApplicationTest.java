package tbz.project.spaceproject;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.boot.SpringApplication;

import static org.mockito.Mockito.mockStatic;

class SpaceProjectApplicationTest {

    @Test
    void mainDelegatesToSpringApplication() {
        String[] args = {"--server.port=0"};

        try (MockedStatic<SpringApplication> spring = mockStatic(SpringApplication.class)) {
            SpaceProjectApplication.main(args);

            spring.verify(() -> SpringApplication.run(SpaceProjectApplication.class, args));
        }
    }

    @Test
    void canBeInstantiated() {
        new SpaceProjectApplication();
    }
}
