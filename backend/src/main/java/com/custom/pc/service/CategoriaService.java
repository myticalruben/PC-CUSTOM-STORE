package com.custom.pc.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.custom.pc.model.Categoria;
import com.custom.pc.repository.CategoriaRepository;

@Service
public class CategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> findAllCategoria() {
        return categoriaRepository.findAll();
    }

    public Categoria saveCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria findCategoriaById(Long c_id) {
        return categoriaRepository.findById(c_id).orElse(null);
    }

    public void deleteCategoria(Long c_id) {
        categoriaRepository.deleteById(c_id);
    }
}
