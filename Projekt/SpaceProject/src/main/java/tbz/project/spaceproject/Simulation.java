package tbz.project.spaceproject;

import org.springframework.stereotype.Component;
import tbz.project.spaceproject.Exception.PlanetApiException;

import java.util.Scanner;

@Component
public class Simulation extends TripSimulation {

    private final PlanetAPIService planetAPIService;
    private final PlanetTracker<Planet> tracker = new PlanetTracker<>();
    private Planet currentPlanet;

    public Simulation(PlanetAPIService planetAPIService) {
        this.planetAPIService = planetAPIService;
    }

    @Override
    protected void chooseDestination() {
        Scanner scanner = new Scanner(System.in);
        boolean validChoice = false;

        while (!validChoice) {
            System.out.println("Please choose your Destination:");
            for (Destination d : Destination.values()) {
                System.out.println(d.getMenuNumber() + ". " + d.name());
            }
            System.out.println("8. View all visited planets");
            System.out.print("Enter number: ");

            int selectedChoice;
            try {
                selectedChoice = Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input, try again.\n");
                continue;
            }

            // Show visited Planets collection
            if (selectedChoice == 8) {
                tracker.showAll();
                continue;
            }

            Destination destination = Destination.fromMenuNumber(selectedChoice);

            if (destination == null) {
                System.out.println("Unknown destination ❓ Try again.\n");
                continue;
            }

            System.out.println("\nFor this Destination please board Aircraft " + destination.getAircraft());
            sleep(500);
            System.out.println("\nBoarding...\n");
            sleep(500);
            System.out.println(
                    "You have boarded Aircraft " + destination.getAircraft()
                    + ", buckle your seatbelt and we're starting for take off.\n"
            );

            try {
                currentPlanet = planetAPIService.getPlanet(destination.getPlanetId());
                tracker.add(currentPlanet);
                validChoice = true;
            } catch (PlanetApiException e) {
                throw new PlanetApiException("Planet API is unavailable", e);

            }
        }
    }


    @Override
    protected void explorePlanet() {
        if (currentPlanet == null) return;

        System.out.println(currentPlanet.getInfo() + "\n");

        if (currentPlanet.isExplorable()) {
            System.out.println("You can explore this planet: " + currentPlanet.explore() + "\n");
        } else {
            System.out.println("Cannot explore: " + currentPlanet.getNotExplorableReason() + "\n");
        }
    }
}
