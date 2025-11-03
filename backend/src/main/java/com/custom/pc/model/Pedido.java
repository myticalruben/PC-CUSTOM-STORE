package com.custom.pc.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String clienteNombre;
    private String clienteEmail;
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;
    
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ComponentePedido> componentes = new ArrayList<>();
    
    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private Factura factura;
    
    public Pedido(String clienteNombre, String clienteEmail, String descripcion) {
        this.clienteNombre = clienteNombre;
        this.clienteEmail = clienteEmail;
        this.descripcion = descripcion;
        this.estado = EstadoPedido.SOLICITUD;
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }
}

