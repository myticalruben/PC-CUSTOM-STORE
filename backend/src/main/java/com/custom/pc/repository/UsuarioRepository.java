package com.custom.pc.repository;

import com.custom.pc.model.RolUsuario;
import com.custom.pc.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuario por email
    Optional<Usuario> findByEmail(String email);

    // Verificar si existe un usuario con el email
    boolean existsByEmail(String email);

    // Buscar usuarios por rol
    List<Usuario> findByRol(RolUsuario rol);

    // Buscar usuarios activos
    List<Usuario> findByActivoTrue();

    // Buscar usuarios por rol y estado activo
    List<Usuario> findByRolAndActivoTrue(RolUsuario rol);

    // Contar usuarios por rol
    long countByRol(RolUsuario rol);

    // Buscar usuarios con paginación (opcional)
    @Query("SELECT u FROM Usuario u WHERE u.activo = true ORDER BY u.fechaCreacion DESC")
    List<Usuario> findAllActiveUsers();

    // Buscar usuarios por nombre o apellido (búsqueda)
    @Query("SELECT u FROM Usuario u WHERE u.activo = true AND " +
            "(LOWER(u.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.apellido) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Usuario> searchActiveUsers(String search);

}
