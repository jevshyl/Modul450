package tbz.project.spaceproject.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tbz.project.spaceproject.User;
import tbz.project.spaceproject.service.UserService;
import tbz.project.spaceproject.Exception.UsernameAlreadyExistsException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    private static User alice(UUID id) {
        return User.builder()
                .id(id)
                .username("Alice")
                .exploredPlanets(List.of())
                .build();
    }

    @Test
    @DisplayName("POST /api/users creates a user and returns 201")
    void createsAUser() throws Exception {
        UUID id = UUID.randomUUID();
        when(userService.createUser("Alice")).thenReturn(alice(id));

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "Alice"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.username").value("Alice"))
                .andExpect(jsonPath("$.exploredPlanets", hasSize(0)));
    }

    @Test
    void returnsConflictWhenTheUsernameAlreadyExists() throws Exception {
        when(userService.createUser("Alice"))
                .thenThrow(new UsernameAlreadyExistsException("Alice"));

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "Alice"}
                                """))
                .andExpect(status().isConflict());
    }

    @Test
    void rejectsAMissingUsername() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsABlankUsername() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "  "}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/users/{id} returns a known user")
    void returnsUserById() throws Exception {
        UUID id = UUID.randomUUID();
        when(userService.getUser(id)).thenReturn(Optional.of(alice(id)));

        mockMvc.perform(get("/api/users/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.username").value("Alice"))
                .andExpect(jsonPath("$.exploredPlanets", hasSize(0)));
    }

    @Test
    void returnsExploredPlanetsOfAUser() throws Exception {
        UUID id = UUID.randomUUID();
        User explorer = User.builder()
                .id(id)
                .username("Alice")
                .exploredPlanets(List.of("mars", "venus"))
                .build();
        when(userService.getUser(id)).thenReturn(Optional.of(explorer));

        mockMvc.perform(get("/api/users/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exploredPlanets", hasSize(2)))
                .andExpect(jsonPath("$.exploredPlanets[0]").value("mars"));
    }

    @Test
    void returnsNotFoundForAnUnknownUser() throws Exception {
        UUID unknownId = UUID.randomUUID();
        when(userService.getUser(unknownId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/{id}", unknownId))
                .andExpect(status().isNotFound());
    }

    @Test
    void returnsBadRequestForAnInvalidUuid() throws Exception {
        mockMvc.perform(get("/api/users/abc"))
                .andExpect(status().isBadRequest());
    }
}