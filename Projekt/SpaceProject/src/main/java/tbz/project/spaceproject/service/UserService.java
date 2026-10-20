package tbz.project.spaceproject.service;

import org.springframework.stereotype.Service;
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
            throw new IllegalArgumentException("Username must not be blank");
        }
        if (userRepository.existsByUsername(username)) {
            throw new UsernameAlreadyExistsException(username);
        }
        return userRepository.save(new User(UUID.randomUUID(), username));
    }

    public Optional<User> getUser(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> explorePlanet(UUID id, String planet) {
        return userRepository.findById(id).map(user -> {
            user.explorePlanet(planet);
            return userRepository.save(user);
        });
    }
}