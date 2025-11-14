package com.custom.pc.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String pass;

    private String nombre;
    private String apellido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolUsuario rol;

    private boolean activo = true;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaUltimoAcceso;

    @OneToMany(mappedBy = "usuario")
    private Set<Pedido> pedidos = new HashSet<>();

    public Usuario(String u_email, String u_pass, String u_nombre, String u_apellido, RolUsuario u_rol) {
        this.email = u_email;
        this.pass = u_pass;
        this.nombre = u_nombre;
        this.apellido = u_apellido;
        this.rol = u_rol;
        this.fechaCreacion = LocalDateTime.now();
    }
}

