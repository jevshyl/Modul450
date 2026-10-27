package tbz.project.spaceproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tbz.project.spaceproject.User;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByUsername(String username);
}