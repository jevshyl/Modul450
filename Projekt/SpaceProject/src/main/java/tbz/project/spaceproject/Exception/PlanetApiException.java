package tbz.project.spaceproject.Exception;

public class PlanetApiException extends RuntimeException {
    public PlanetApiException(String id) {
        super("Planet with id " + id + " does not exist: ");
    }

    public PlanetApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
