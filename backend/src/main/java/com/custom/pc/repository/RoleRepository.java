package com.custom.pc.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.custom.pc.model.ERole;
import com.custom.pc.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{
    Optional<Role> findByName(ERole name);
}
