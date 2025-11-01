package com.custom.pc.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.custom.pc.model.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long>{
    
}
