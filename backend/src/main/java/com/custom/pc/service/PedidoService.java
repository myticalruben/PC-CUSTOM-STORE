package com.custom.pc.service;

import com.custom.pc.model.*;
import com.custom.pc.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private FacturaRepository facturaRepository;
    
    //Nos da todos los pedidos ordenados por fecha de actualización descendente
    public List<Pedido> findAllPedidos() {
        return pedidoRepository.findAllByOrderByFechaActualizacionDesc();
    }
    
    //Nos da un pedido por su id
    public Pedido findPedidoById(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }
    
    //Guarda un pedido nuevo o actualizado
    public Pedido savePedido(Pedido pedido) {
        pedido.setFechaActualizacion(LocalDateTime.now());
        return pedidoRepository.save(pedido);
    }
    

    //Cambia el estado de un pedido
    public Pedido cambiarEstado(Long pedidoId, EstadoPedido nuevoEstado) {
        //obtenemos el pedido
        Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
        
        //verificamos si el pedido existe
        if (pedido != null) {
            //si es así, cambiamos el estado y actualizamos la fecha
            pedido.setEstado(nuevoEstado);
            pedido.setFechaActualizacion(LocalDateTime.now());
            return pedidoRepository.save(pedido);
        }
        return null;
    }
    
    //Verifica la disponibilidad de los productos en un pedido
    public boolean verificarDisponibilidad(Long pedidoId) {

        //obtener el pedido
        Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
        
        //verificar si el pedido existe
        if (pedido == null) return false;
        
        //verificar la disponibilidad de cada componente
        for (ComponentePedido componente : pedido.getComponentes()) {
            
            //obtener el producto asociado al componente
            Producto producto = componente.getProducto();

            //verificar si el stock es suficiente
            if (producto.getP_stock() < componente.getCantidad()) {
                return false;
            }
        }
        return true;
    }
    
    //Genera una factura para un pedido
    public Factura generarFactura(Long pedidoId) {
        //obtenemos el pedido
        Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
        
        //verificamos si el pedido existe y está en estado FACTURACION
        if (pedido == null || pedido.getEstado() != EstadoPedido.FACTURACION) {
            return null;
        }
        
        //calculamos el total de la factura
        Double total = pedido.getComponentes().stream()
                .mapToDouble(cp -> cp.getProducto().getP_precio() * cp.getCantidad())
                .sum();
        
        Factura factura = new Factura(pedido, total);
        return facturaRepository.save(factura);
    }
}