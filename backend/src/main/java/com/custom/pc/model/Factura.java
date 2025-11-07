package com.custom.pc.model;

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
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;
    
    public Factura(Pedido pedido, Double total) {
        this.pedido = pedido;
        this.total = total;
        this.fechaEmision = LocalDateTime.now();
        this.numeroFactura = "FACT-" + System.currentTimeMillis();
    }
}