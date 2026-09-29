package tbz.project.spaceproject;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Destination {

    MARS(1, "mars", "350"),
    VENUS(2, "venus", "420"),
    MOON(3, "moon", "101"),
    JUPITER(4, "jupiter", "777"),
    SATURN(5, "saturn", "880"),
    NEPTUNE(6, "neptune", "909"),
    URANUS(7, "uranus", "666");

    private final int menuNumber;
    private final String planetId;
    private final String aircraft;

    Destination(int menuNumber, String planetId, String aircraft) {
        this.menuNumber = menuNumber;
        this.planetId = planetId;
        this.aircraft = aircraft;
    }


    public static Destination fromMenuNumber(int menuNumber) {
        return Arrays.stream(values())
                .filter(d -> d.menuNumber == menuNumber)
                .findFirst()
                .orElse(null);
    }
}
