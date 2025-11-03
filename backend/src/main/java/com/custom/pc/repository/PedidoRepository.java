package com.custom.pc.repository;

import com.custom.pc.model.Pedido;
import com.custom.pc.model.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByEstado(EstadoPedido estado);
    
    @Query("SELECT p FROM Pedido p ORDER BY p.fechaActualizacion DESC")
    List<Pedido> findAllByOrderByFechaActualizacionDesc();
}