package tbz.project.spaceproject;

import java.util.Scanner;


/**
 * Represents a template for a space trip simulation.
 * <p>
 * This abstract class defines the overall flow of a space journey
 * using the Template Method pattern. Subclasses must implement
 * destination selection and planet exploration behavior.
 * </p>
 */
public abstract class TripSimulation {

    private final Scanner scanner = new Scanner(System.in);

    public final void runTrip() {
        welcomeMessage();
        chooseDestination();
        countdown();
        blastOff();
        arrival();
        explorePlanet();
        returnTrip();
        farewell();
    }

    protected abstract void chooseDestination();
    protected abstract void explorePlanet();

    protected void welcomeMessage() {
        System.out.println("Welcome to SpaceXplorer\n");
    }

    // 5 Second count down
    protected void countdown() {
        for (int i = 5; i >= 1; i--) {
            System.out.println(i + "..");
            sleep(1000);
        }
        System.out.println();
    }

    protected void blastOff() {
        System.out.println("Blast Off, wish you a wonderful trip!\n");
        sleep(3000);
    }

    protected void arrival() {
        System.out.println("We are arriving at your destination. Here's some Information regarding this Planet:\n");
    }

    protected void returnTrip() {
        String input;
        do {
            System.out.println("Press 'y' when you're ready to head back!");
            input = scanner.nextLine().trim().toLowerCase();
        } while (!input.equals("y"));

        System.out.println("\nWe are heading back to Earth...\n");
        sleep(500);
        System.out.println("We've almost reached Planet Earth, in\n");
        countdown();
    }

    protected void farewell() {
        System.out.println("We're back on Earth dear fellow explorer, we hope you enjoyed your trip.\n");
    }

    /**
     * Pauses the program execution for the specified duration.
     *
     * @param millis time to sleep in milliseconds
     */
    protected void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("Interrupted!");
        }
    }
}
