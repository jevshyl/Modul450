package tbz.project.spaceproject.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import tbz.project.spaceproject.Exception.PlanetApiException;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    @Test
    void mapsPlanetApiExceptionToBadGateway() {
        ProblemDetail problem = new GlobalExceptionHandler()
                .handlePlanetApiException(new PlanetApiException("boom", null));

        assertThat(problem.getStatus()).isEqualTo(HttpStatus.BAD_GATEWAY.value());
        assertThat(problem.getTitle()).isEqualTo("Upstream planet API unavailable");
        assertThat(problem.getDetail()).isEqualTo("boom");
    }
}
