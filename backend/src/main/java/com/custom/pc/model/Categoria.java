package com.custom.pc.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
public class Categoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long c_id;

    private String c_nombre;
    
    private String c_descripcion;

    @OneToMany(mappedBy = "p_categoria_id", cascade = CascadeType.ALL, orphanRemoval = false)
    @JsonIgnore
    private List<Producto> producto;
    
    public Categoria(String c_nombre, String c_descripcion) {
        this.c_nombre = c_nombre;
        this.c_descripcion = c_descripcion;
    }
}
