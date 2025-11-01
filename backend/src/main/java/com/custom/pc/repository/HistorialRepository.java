package com.custom.pc.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.custom.pc.model.Historial;

@Repository
public interface HistorialRepository extends JpaRepository<Historial, Long>{
    
}
