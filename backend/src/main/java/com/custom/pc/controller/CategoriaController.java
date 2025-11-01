package com.custom.pc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.custom.pc.dto.CategoriaDTO;
import com.custom.pc.model.Categoria;
import com.custom.pc.service.CategoriaService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/inventario/categoria")
public class CategoriaController {
    
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/listar")
    public ResponseEntity<?> allCategorias() {
        return ResponseEntity.ok(categoriaService.findAllCategoria());
    }

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarCategoria(@RequestBody Categoria categoria) {
        return new ResponseEntity<Categoria>(categoriaService.saveCategoria(categoria), HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<Void> eliminarCategoria(@RequestBody CategoriaDTO categoriaDTO) {
        categoriaService.deleteCategoria(categoriaDTO.getC_id());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
