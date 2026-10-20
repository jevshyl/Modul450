package tbz.project.spaceproject;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.Scanner;
import java.util.function.IntConsumer;

@Component
@ConditionalOnProperty(name = "app.cli.enabled", havingValue = "true")
public class SimulationRunner implements CommandLineRunner {

    private final Simulation simulation;
    private IntConsumer exitHandler = System::exit;

    public SimulationRunner(Simulation simulation) {
        this.simulation = simulation;
    }

    void setExitHandler(IntConsumer exitHandler) {
        this.exitHandler = exitHandler;
    }

    @Override
    public void run(String... args) {

        Scanner scanner = new Scanner(System.in);
        boolean keepPlaying = true;

        while (keepPlaying) {
            simulation.runTrip();

            String again;
            while (true) {
                System.out.println("Would you like to play again? (y/n)");
                again = scanner.nextLine().trim().toLowerCase();
                if (again.equals("y") || again.equals("n")) break;
                System.out.println("Invalid input, enter 'y' or 'n'.");
            }

            if (again.equals("n")) {
                keepPlaying = false;
            }
        }

        System.out.println("Adios Amigo 👋");
        exitHandler.accept(0);
    }
}
