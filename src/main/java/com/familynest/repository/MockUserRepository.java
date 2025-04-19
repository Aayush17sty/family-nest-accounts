
package com.familynest.repository;

import com.familynest.model.User;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@Primary
public class MockUserRepository implements UserRepository {
    private List<User> users;
    private Long currentId = 1L;

    public MockUserRepository() {
        users = new ArrayList<>();
        // Add dummy parent user
        User parentUser = new User();
        parentUser.setId(currentId++);
        parentUser.setUsername("parent");
        parentUser.setEmail("parent@example.com");
        parentUser.setPassword("$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG"); // password: "password"
        parentUser.setRole(User.Role.PARENT);
        users.add(parentUser);

        // Add dummy child user
        User childUser = new User();
        childUser.setId(currentId++);
        childUser.setUsername("child");
        childUser.setEmail("child@example.com");
        childUser.setPassword("$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG"); // password: "password"
        childUser.setRole(User.Role.CHILD);
        childUser.setParent(parentUser);
        users.add(childUser);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return users.stream()
                .filter(user -> user.getUsername().equals(username))
                .findFirst();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return users.stream()
                .filter(user -> user.getEmail().equals(email))
                .findFirst();
    }

    @Override
    public boolean existsByUsername(String username) {
        return users.stream().anyMatch(user -> user.getUsername().equals(username));
    }

    @Override
    public boolean existsByEmail(String email) {
        return users.stream().anyMatch(user -> user.getEmail().equals(email));
    }

    @Override
    public Optional<User> findById(Long id) {
        return users.stream()
                .filter(user -> user.getId().equals(id))
                .findFirst();
    }

    @Override
    public User save(User user) {
        if (user.getId() == null) {
            user.setId(currentId++);
        }
        users.removeIf(existingUser -> existingUser.getId().equals(user.getId()));
        users.add(user);
        return user;
    }
}
