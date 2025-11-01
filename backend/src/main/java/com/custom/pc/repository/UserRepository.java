package com.custom.pc.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.custom.pc.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
}
