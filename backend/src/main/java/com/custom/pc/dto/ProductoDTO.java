package com.custom.pc.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProductoDTO {
    private Long p_id;
    private String p_nombre;
    private String p_codigo;
    private Double p_precio;
    private Integer p_stock;
    private Long p_categoria_id;
    private LocalDate p_fecha_creacion;
}
