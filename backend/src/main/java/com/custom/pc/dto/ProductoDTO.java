package com.custom.pc.dto;

public class ProductoDTO {
    private Long p_id;
    private String p_nombre;
    private String p_codigo;
    private Double p_precio;
    private Integer p_stock;
    private Long p_categoria_id;

    public Long getP_id() {return p_id;}
    public void setP_id(Long p_id) {this.p_id = p_id;}

    public String getProductoNombre() {return p_nombre;}
    public void setProductoNombre(String p_nombre) {this.p_nombre = p_nombre;}

    public String getProductoCodigo() {return p_codigo;}
    public void setProductoCodigo(String p_codigo) {this.p_codigo = p_codigo;}

    public Double getProductoPrecio() {return p_precio;}
    public void setProductoPrecio(Double p_precio) {this.p_precio = p_precio;}

    public Integer getProductoStock() {return p_stock;}
    public void setProductoStock(Integer p_stock) {this.p_stock = p_stock;}

    public Long getP_categoria_id() {return p_categoria_id;}
    public void setP_categoria_id(Long p_categoria_id) {this.p_categoria_id = p_categoria_id;}
}
