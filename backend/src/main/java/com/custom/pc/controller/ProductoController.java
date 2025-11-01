package com.custom.pc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.custom.pc.model.Producto;

import com.custom.pc.service.ProductoService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/inventario/producto")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;

    @GetMapping("/listar")
    public ResponseEntity<?> allProducto() {
        return ResponseEntity.ok(productoService.findAllProducto());
    }

    @GetMapping("/listar/categorias/{id}")
    public ResponseEntity<?> allProductobyCategoria(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findByPCategoriaId_CId(id));
    }

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarCategoria(@RequestBody Producto producto) {
        return new ResponseEntity<Producto>(productoService.saveProducto(producto), HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<Void> eliminarCategoria(@RequestBody Producto producto) {
        productoService.deleteProducto(producto.getP_id());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
