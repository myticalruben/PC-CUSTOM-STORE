package com.custom.pc.model;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@NamedQueries({
    @NamedQuery(
        name = "Producto.buscaProductoPorCategoriaId",
        query = "SELECT p FROM Producto p WHERE p.p_categoria_id.c_id = :c_id"
       ),
    @NamedQuery(
        name = "Producto.findAllByPCategoriaNombre",
        query = "SELECT p FROM Producto p WHERE p.p_categoria_id.c_nombre = :c_nombre"
       )
} )
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long p_id;

    private String p_nombre;
    
    private String p_codigo;
    
    private Double p_precio;
    
    private Integer p_stock;
    
    private LocalDate p_fecha_creacion;
    
    @JoinColumn(name = "p_categoria_id", referencedColumnName = "c_id")
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Categoria p_categoria_id;

    public Producto(String p_nombre, String p_codigo, Double p_precio, Integer p_stock, LocalDate p_fecha_creacion, Categoria p_categoria_id) {
        this.p_nombre = p_nombre;
        this.p_codigo = p_codigo;
        this.p_precio = p_precio;
        this.p_stock = p_stock;
        this.p_fecha_creacion = p_fecha_creacion;
        this.p_categoria_id = p_categoria_id;
    }
}
