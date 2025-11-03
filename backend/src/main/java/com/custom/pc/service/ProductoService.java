package com.custom.pc.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.custom.pc.model.Producto;
import com.custom.pc.repository.ProductoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> findAllProducto() {
        return productoRepository.findAll();
    }

    public Producto findProductoById(Long p_id) {
        return productoRepository.findById(p_id).orElse(null);
    }

    public List<Producto> findByPCategoriaId_CId(Long c_id) {
        return productoRepository.buscaProductoPorCategoriaId(c_id);
    }

    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }
    
    public void deleteProducto(Long p_id) {
        productoRepository.deleteById(p_id);
    }
}
