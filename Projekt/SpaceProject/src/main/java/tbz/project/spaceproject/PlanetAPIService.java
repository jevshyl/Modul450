package tbz.project.spaceproject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import tbz.project.spaceproject.DTO.PlanetApiDTO;
import tbz.project.spaceproject.Exception.PlanetApiException;

@Service
public class PlanetAPIService {

    // API URL
    @Value("${solar.api.base-url}")
    private String baseUrl;

    // API TOKEN
    @Value("${solar.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Planet getPlanet(String planetId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);


     // GET Method
        try {
            ResponseEntity<PlanetApiDTO> response = restTemplate.exchange(
                    baseUrl + "/bodies/" + planetId,
                    HttpMethod.GET,
                    entity,
                    PlanetApiDTO.class
            );

            PlanetApiDTO dto = response.getBody();

            if (dto == null) {
                throw new PlanetApiException(planetId);
            }

            return PlanetFactory.createFromApi(dto);

        } catch (RestClientException e) {
            throw new PlanetApiException(
                    "Failed to fetch planet with id " + planetId,
                    e
            );
        }
    }
}

