package com.custom.pc.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "facturas")
public class Factura {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String numeroFactura;
    private Double total;
    private LocalDateTime fechaEmision;
    
    @OneToOne
    @JsonBackReference
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;
    
    public Factura(Pedido pedido, Double total) {
        this.pedido = pedido;
        this.total = total;
        this.fechaEmision = LocalDateTime.now();
        this.numeroFactura = "FACT-" + System.currentTimeMillis();
    }
}