package com.custom.pc.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "historial")
@Getter
@Setter
@NoArgsConstructor
public class Historial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long h_id;

    @ManyToOne
    private Producto h_producto_id;
    
    private LocalDate h_fecha;
    private String h_nota;
    private String h_refrerencia;
    private Integer h_cantidad;

    public Historial(Producto h_producto_id, LocalDate h_fecha, String h_nota, String h_refrerencia, Integer h_cantidad) {
        this.h_producto_id = h_producto_id;
        this.h_fecha = h_fecha;
        this.h_nota = h_nota;
        this.h_refrerencia = h_refrerencia;
        this.h_cantidad = h_cantidad;
    }
}
