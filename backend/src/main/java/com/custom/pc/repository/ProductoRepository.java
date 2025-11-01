package com.custom.pc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.custom.pc.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long>{
    
    List<Producto> buscaProductoPorCategoriaId(Long c_id);
}
