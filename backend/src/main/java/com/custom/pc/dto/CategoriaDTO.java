package com.custom.pc.dto;

public class CategoriaDTO {
    private Long c_id;
    private String c_nombre;
    private String c_descripcion;

    public Long getC_id() {return c_id;}
    public void setC_id(Long c_id) {this.c_id = c_id;}

    public String getCategoriaNombre() {return c_nombre;}
    public void setCategoriaNombre(String c_nombre) {this.c_nombre = c_nombre;}

    public String getCategoriaDescripcion() {return c_descripcion;}
    public void setCategoriaDescripcion(String c_descripcion) {this.c_descripcion = c_descripcion;}
}
