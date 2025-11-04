package com.custom.pc.service;

import java.util.List;

import com.custom.pc.dto.ProductoDTO;
import com.custom.pc.model.Categoria;
import com.custom.pc.repository.CategoriaRepository;
import jakarta.persistence.EntityNotFoundException;
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

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Producto> findAllProducto() {
        return productoRepository.findAll();
    }

    public Producto findProductoById(Long p_id) {
        return productoRepository.findById(p_id).orElse(null);
    }

    public List<Producto> findByPCategoriaId_CId(Long c_id) {
        return productoRepository.buscaProductoPorCategoriaId(c_id);
    }

    public Producto saveProducto(Producto pro) {
        Categoria c_id = categoriaRepository.findById(pro.getP_categoria_id().getC_id()).get();
        pro.setP_categoria_id(c_id);
        return productoRepository.save(pro);
    }

    public Producto updateProducto(Long id, Producto producto) {
        Producto pro = productoRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("No exite el producto a acutalizar")
        );

        Categoria c = categoriaRepository.findById(producto.getP_categoria_id().getC_id()).orElseThrow(
                () -> new EntityNotFoundException("No exite la categoria a acutalizar")
        );

        pro.setP_nombre(producto.getP_nombre());
        pro.setP_codigo(producto.getP_codigo());
        pro.setP_precio(producto.getP_precio());
        pro.setP_stock(producto.getP_stock());
        pro.setP_categoria_id(c);
        return productoRepository.save(pro);
    }
    
    public void deleteProducto(Long p_id) {
        productoRepository.deleteById(p_id);
    }
}
