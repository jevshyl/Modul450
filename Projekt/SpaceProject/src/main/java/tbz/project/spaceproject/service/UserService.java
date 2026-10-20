package tbz.project.spaceproject.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tbz.project.spaceproject.Exception.UsernameAlreadyExistsException;
import tbz.project.spaceproject.User;
import tbz.project.spaceproject.repository.UserRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException(
                    "Username must not be blank");
        }

        username = username.trim();

        if (userRepository.existsByUsername(username)) {
            throw new UsernameAlreadyExistsException(username);
        }

        return userRepository.save(
                new User(UUID.randomUUID(), username));
    }

    public Optional<User> getUser(UUID id) {
        return userRepository.findById(id);
    }

    @Transactional
    public Optional<User> explorePlanet(UUID id, String planet) {
        if (planet == null || planet.isBlank()) {
            throw new IllegalArgumentException(
                    "Planet name must not be blank");
        }

        String planetName = planet.trim();

        return userRepository.findById(id).map(user -> {
            boolean alreadyExplored = user.getExploredPlanets()
                    .stream()
                    .anyMatch(existing ->
                            existing.equalsIgnoreCase(planetName));

            if (!alreadyExplored) {
                user.explorePlanet(planetName);
                userRepository.save(user);
            }

            return user;
        });
    }
}