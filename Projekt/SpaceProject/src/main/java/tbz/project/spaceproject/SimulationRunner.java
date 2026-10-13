package tbz.project.spaceproject;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.Scanner;

@Component
@ConditionalOnProperty(name = "app.cli.enabled", havingValue = "true")
public class SimulationRunner implements CommandLineRunner {

    private final Simulation simulation;

    public SimulationRunner(Simulation simulation) {
        this.simulation = simulation;
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
        System.exit(0);
    }
}
