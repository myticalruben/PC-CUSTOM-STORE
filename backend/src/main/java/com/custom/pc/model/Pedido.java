package com.custom.pc.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "pedidos")
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
    
    @OneToMany(
            mappedBy = "pedido",
            orphanRemoval = true,
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL
    )
    @JsonManagedReference
    private List<ComponentePedido> componentes;
    
    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    @JsonManagedReference
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

