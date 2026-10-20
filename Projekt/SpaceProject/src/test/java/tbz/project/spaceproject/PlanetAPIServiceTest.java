package tbz.project.spaceproject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;
import tbz.project.spaceproject.Exception.PlanetApiException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.within;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

/**
 * Unit tests for {@link PlanetAPIService}. The outbound {@link RestTemplate} is
 * intercepted with {@link MockRestServiceServer}, so no real HTTP call is made.
 */
class PlanetAPIServiceTest {

    private static final String BASE_URL = "https://solar.example.test";
    private static final String API_KEY = "test-key";

    private PlanetAPIService service;
    private MockRestServiceServer server;

    @BeforeEach
    void setUp() {
        service = new PlanetAPIService();

        ReflectionTestUtils.setField(service, "baseUrl", BASE_URL);
        ReflectionTestUtils.setField(service, "apiKey", API_KEY);

        RestTemplate restTemplate = (RestTemplate) ReflectionTestUtils.getField(service, "restTemplate");
        server = MockRestServiceServer.bindTo(restTemplate).build();
    }

    @Test
    @DisplayName("GET /bodies/{id} is sent with a bearer token and mapped onto a Planet")
    void mapsApiResponseToPlanet() {
        String json = """
                {
                  "id": "mars",
                  "englishName": "Mars",
                  "gravity": 3.71,
                  "avgTemp": 210.0,
                  "mass": { "massValue": 6.39, "massExponent": 23 },
                  "vol": { "volValue": 1.63, "volExponent": 11 },
                  "discoveryDate": "1659",
                  "discoveredBy": "Christiaan Huygens"
                }
                """;

        server.expect(requestTo(BASE_URL + "/bodies/mars"))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("Authorization", "Bearer " + API_KEY))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        Planet planet = service.getPlanet("mars");

        assertThat(planet.getId()).isEqualTo("mars");
        assertThat(planet.getName()).isEqualTo("Mars");
        assertThat(planet.getGravity()).isEqualTo(3.71);
        assertThat(planet.getTemperature()).isEqualTo(210.0);
        assertThat(planet.getMass()).isCloseTo(6.39e23, within(1e10));
        assertThat(planet.getVol()).isCloseTo(1.63e11, within(1e2));
        assertThat(planet.getDiscoveryDate()).isEqualTo("1659");
        assertThat(planet.getDiscoveredBy()).isEqualTo("Christiaan Huygens");
        server.verify();
    }

    @Test
    @DisplayName("missing numeric fields default to zero instead of failing")
    void defaultsMissingFieldsToZero() {
        String json = """
                { "id": "void", "englishName": "Void" }
                """;

        server.expect(requestTo(BASE_URL + "/bodies/void"))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        Planet planet = service.getPlanet("void");

        assertThat(planet.getGravity()).isZero();
        assertThat(planet.getTemperature()).isZero();
        assertThat(planet.getMass()).isZero();
        assertThat(planet.getVol()).isZero();
        server.verify();
    }

    @Test
    @DisplayName("an empty response body becomes a PlanetApiException")
    void throwsWhenResponseBodyIsMissing() {
        server.expect(requestTo(BASE_URL + "/bodies/ghost"))
                .andRespond(withStatus(HttpStatus.NO_CONTENT));

        assertThatThrownBy(() -> service.getPlanet("ghost"))
                .isInstanceOf(PlanetApiException.class)
                .hasMessageContaining("ghost");
        server.verify();
    }

    @Test
    @DisplayName("transport failures are wrapped in a PlanetApiException")
    void wrapsRestClientException() {
        server.expect(requestTo(BASE_URL + "/bodies/broken"))
                .andRespond(withServerError());

        assertThatThrownBy(() -> service.getPlanet("broken"))
                .isInstanceOf(PlanetApiException.class)
                .hasMessageContaining("broken")
                .hasCauseInstanceOf(RuntimeException.class);
        server.verify();
    }
}
