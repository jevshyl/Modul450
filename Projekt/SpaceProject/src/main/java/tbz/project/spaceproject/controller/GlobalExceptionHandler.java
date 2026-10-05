package tbz.project.spaceproject.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import tbz.project.spaceproject.Exception.PlanetApiException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(PlanetApiException.class)
    public ProblemDetail handlePlanetApiException(PlanetApiException e) {
        log.warn("Solar System API failure: {}", e.getMessage());
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_GATEWAY);
        problem.setTitle("Upstream planet API unavailable");
        problem.setDetail(e.getMessage());
        return problem;
    }
}
