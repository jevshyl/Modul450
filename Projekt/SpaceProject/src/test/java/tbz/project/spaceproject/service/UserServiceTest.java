package tbz.project.spaceproject.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tbz.project.spaceproject.User;
import tbz.project.spaceproject.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private UUID uuid;
    private User user;

    @BeforeEach
    void setUp() {
        uuid = UUID.randomUUID();
        user = new User(uuid, "Alice");
    }

    @Test
    @DisplayName("createUser saves a new user and returns it")
    void createsAUser() {
        when(userRepository.existsByUsername("Alice")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.createUser("Alice");

        assertEquals(uuid, result.getId());
        assertEquals("Alice", result.getUsername());
        assertTrue(result.getExploredPlanets().isEmpty());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("Alice", captor.getValue().getUsername());
    }

    @Test
    void throwsWhenTheUsernameAlreadyExists() {
        when(userRepository.existsByUsername("Alice")).thenReturn(true);

        assertThrows(UsernameAlreadyExistsException.class,
                () -> userService.createUser("Alice"));

        verify(userRepository, never()).save(any());
    }

    @Test
    void rejectsABlankUsername() {
        assertThrows(IllegalArgumentException.class,
                () -> userService.createUser("  "));

        verifyNoInteractions(userRepository);
    }

    @Test
    @DisplayName("getUser returns the user when found")
    void returnsUserById() {
        when(userRepository.findById(uuid)).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUser(uuid);

        assertTrue(result.isPresent());
        assertEquals(uuid, result.get().getId());
        assertEquals("Alice", result.get().getUsername());
        assertTrue(result.get().getExploredPlanets().isEmpty());
    }

    @Test
    void returnsEmptyForAnUnknownUser() {
        UUID unknownId = UUID.randomUUID();
        when(userRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertTrue(userService.getUser(unknownId).isEmpty());
    }

    @Test
    @DisplayName("explorePlanet adds the planet and saves the user")
    void addsAnExploredPlanet() {
        when(userRepository.findById(uuid)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        Optional<User> result = userService.explorePlanet(uuid, "mars");

        assertTrue(result.isPresent());
        assertEquals(List.of("mars"), result.get().getExploredPlanets());
        verify(userRepository).save(user);
    }

    @Test
    void doesNotDuplicateAnExploredPlanet() {
        user.explorePlanet("mars");
        when(userRepository.findById(uuid)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        Optional<User> result = userService.explorePlanet(uuid, "mars");

        assertEquals(List.of("mars"), result.orElseThrow().getExploredPlanets());
    }

    @Test
    void returnsEmptyAndSavesNothingWhenExploringForAnUnknownUser() {
        UUID unknownId = UUID.randomUUID();
        when(userRepository.findById(unknownId)).thenReturn(Optional.empty());

        Optional<User> result = userService.explorePlanet(unknownId, "mars");

        assertTrue(result.isEmpty());
        verify(userRepository, never()).save(any());
    }
}