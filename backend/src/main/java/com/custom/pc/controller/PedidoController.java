package com.custom.pc.controller;

import com.custom.pc.model.*;
import com.custom.pc.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/pedidos")
public class PedidoController {
    
    @Autowired
    private PedidoService pedidoService;
    
    @GetMapping
    public ResponseEntity<List<Pedido>> getAllPedidos() {
        return ResponseEntity.ok(pedidoService.findAllPedidos());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable Long id) {
        Pedido pedido = pedidoService.findPedidoById(id);
        return pedido != null ? ResponseEntity.ok(pedido) : ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        return ResponseEntity.ok(pedidoService.savePedido(pedido));
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<Pedido> cambiarEstado(
            @PathVariable Long id, 
            @RequestBody EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoService.cambiarEstado(id, nuevoEstado);
        return pedido != null ? ResponseEntity.ok(pedido) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/{id}/verificar-disponibilidad")
    public ResponseEntity<Boolean> verificarDisponibilidad(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.verificarDisponibilidad(id));
    }
    
    @PostMapping("/{id}/facturar")
    public ResponseEntity<Factura> generarFactura(@PathVariable Long id) {
        Factura factura = pedidoService.generarFactura(id);
        return factura != null ? ResponseEntity.ok(factura) : ResponseEntity.badRequest().build();
    }
}