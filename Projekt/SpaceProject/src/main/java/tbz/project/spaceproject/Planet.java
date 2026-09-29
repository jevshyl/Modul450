package tbz.project.spaceproject;

public class Planet extends SpaceObject implements Explorable {

    private static final double MIN_EXPLORABLE_TEMP = 100;
    private static final double MAX_EXPLORABLE_SUIT = 500;

    private final double gravity;
    private final String discoveredBy;
    private final String discoveryDate;
    private final double temperature;
    private final double mass;
    private final double vol;

    private boolean explorable;
    private String notExplorableReason;

    public Planet(String id, String name, double gravity, double temperature, double mass, double vol, String discoveryDate, String discoveredBy) {
        super(id, name);
        this.gravity = gravity;
        this.temperature = temperature;
        this.mass = mass;
        this.vol = vol;
        this.discoveryDate = discoveryDate;
        this.discoveredBy = discoveredBy;

        evaluateExplorability();
    }

    private void evaluateExplorability() {
        explorable = true;
        notExplorableReason = "";

        // Temperature extremes are survivable with suit
        if (temperature < MIN_EXPLORABLE_TEMP) {
            explorable = false;
            notExplorableReason = "Temperature too low even for a suit!";
        } else if (temperature > MAX_EXPLORABLE_SUIT) {
            explorable = false;
            notExplorableReason = "Temperature too high even for a suit!";
        }

        // Gravity extremes
        else if (gravity < 0.1) {
            explorable = false;
            notExplorableReason = "Gravity too low → you cannot stand!";
        } else if (gravity > 3.0) {
            explorable = false;
            notExplorableReason = "Gravity too high → you would be crushed!";
        }
    }


    @Override
    public boolean isExplorable() {
        return explorable;
    }

    @Override
    public String getNotExplorableReason() {
        return notExplorableReason;
    }

    @Override
    public String getInfo() {
        StringBuilder info = new StringBuilder();
        info.append("Planet ").append(getName())
                .append("\nID: ").append(getId())
                .append("\nGravity: ").append(gravity).append(" m/s²")
                .append("\nTemperature: ").append(String.format("%.2f", temperature - 273.15)).append(" °C")
                .append("\nMass: ").append(mass).append(" kg")
                .append("\nVolume: ").append(vol).append(" km³");

        if (discoveredBy != null && !discoveredBy.isBlank()) {
            info.append("\nDiscovered By: ").append(discoveredBy);
        }

        if (discoveryDate != null && !discoveryDate.isBlank()) {
            info.append("\nDiscovery Date: ").append(discoveryDate);
        }

        return info.toString();
    }


    @Override
    public String explore() {
        if (explorable) {
            return "Exploring planet " + getName() + "!";
        } else {
            return "Cannot explore " + getName() + ": " + notExplorableReason;
        }
    }
}

