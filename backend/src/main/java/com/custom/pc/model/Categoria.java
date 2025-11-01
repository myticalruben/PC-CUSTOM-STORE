package com.custom.pc.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    
    private LocalDate c_fecha_creacion;

    public Categoria(String c_nombre, String c_descripcion, LocalDate c_fecha_creacion) {
        this.c_nombre = c_nombre;
        this.c_descripcion = c_descripcion;
        this.c_fecha_creacion = c_fecha_creacion;
    }
}
