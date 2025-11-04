package com.custom.pc.controller;

import com.custom.pc.dto.ProductoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.custom.pc.model.Producto;

import com.custom.pc.service.ProductoService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/inventario/productos")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;

    @GetMapping("/listar")
    public ResponseEntity<?> allProducto() {
        return ResponseEntity.ok(productoService.findAllProducto());
    }

    @GetMapping("/listar/{id}")
    public ResponseEntity<?> findProductoById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findProductoById(id));
    }


    @GetMapping("/listar/categorias/{id}")
    public ResponseEntity<?> allProductobyCategoria(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findByPCategoriaId_CId(id));
    }

    @PostMapping("/agregar")
    public ResponseEntity<?> productoCategoria(@RequestBody Producto producto) {
        return new ResponseEntity<Producto>(productoService.saveProducto(producto), HttpStatus.ACCEPTED);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizarCategoria(@PathVariable Long id, @RequestBody Producto producto) {
        return new ResponseEntity<Producto>(productoService.updateProducto(id, producto), HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        productoService.deleteProducto(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
