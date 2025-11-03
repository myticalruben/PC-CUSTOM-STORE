package com.custom.pc.repository;

import com.custom.pc.model.ComponentePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComponentePedidoRepository extends JpaRepository<ComponentePedido, Long> {
}