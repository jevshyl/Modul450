package tbz.project.spaceproject.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tbz.project.spaceproject.User;
import tbz.project.spaceproject.service.UserService;

import java.net.URI;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    public record CreateUserRequest(@NotBlank String username) {
    }

    public record ExplorePlanetRequest(@NotBlank String planetName) {
    }

    @PostMapping
    public ResponseEntity<User> createUser(
            @Valid @RequestBody CreateUserRequest request) {

        User created = userService.createUser(request.username());

        return ResponseEntity
                .created(URI.create("/api/users/" + created.getId()))
                .body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable UUID id) {
        return userService.getUser(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/explored-planets")
    public ResponseEntity<User> explorePlanet(
            @PathVariable UUID id,
            @Valid @RequestBody ExplorePlanetRequest request) {

        Optional<User> user =
                userService.explorePlanet(id, request.planetName());

        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}