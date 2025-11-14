package com.custom.pc.dto;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String nombre;
    private String apellido;
    private String rol;

    public JwtResponse(String token, Long id, String email, String nombre, String apellido, String rol) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.rol = rol;
    }

    // Getters
    public Long getId() { return id; }
    public String getRol() { return rol; }
    public String getType() { return type; }
    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
}
