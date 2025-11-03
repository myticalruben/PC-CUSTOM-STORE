package com.custom.pc.service;

import com.custom.pc.model.*;
import com.custom.pc.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private FacturaRepository facturaRepository;

    @InjectMocks
    private PedidoService pedidoService;

    private Pedido pedido;
    private Producto producto;
    private Categoria categoria;

    @BeforeEach
    void setUp() {
        categoria = new Categoria("Procesadores", "Procesadores de alta gama");
        categoria.setC_id(1L);

        producto = new Producto(
            "Intel i9", 
            "INTEL-I9-13900K", 
            499.99, 
            10, 
            LocalDate.now(), 
            categoria
        );
        producto.setP_id(1L);

        pedido = new Pedido("Juan Perez", "juan@email.com", "PC Gaming");
        pedido.setId(1L);
        
        ComponentePedido componente = new ComponentePedido(pedido, producto, 1);
        pedido.setComponentes(Arrays.asList(componente));
    }

    @Test
    void testFindAllPedidos() {
        // Given
        List<Pedido> pedidos = Arrays.asList(pedido);
        when(pedidoRepository.findAllByOrderByFechaActualizacionDesc()).thenReturn(pedidos);

        // When
        List<Pedido> result = pedidoService.findAllPedidos();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Juan Perez", result.get(0).getClienteNombre());
        verify(pedidoRepository, times(1)).findAllByOrderByFechaActualizacionDesc();
    }

    @Test
    void testFindPedidoById() {
        // Given
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        // When
        Pedido result = pedidoService.findPedidoById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Juan Perez", result.getClienteNombre());
        verify(pedidoRepository, times(1)).findById(1L);
    }

    @Test
    void testSavePedido() {
        // Given
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedido);

        // When
        Pedido result = pedidoService.savePedido(pedido);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(pedidoRepository, times(1)).save(pedido);
    }

    @Test
    void testCambiarEstado() {
        // Given
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedido);

        // When
        Pedido result = pedidoService.cambiarEstado(1L, EstadoPedido.ANALISIS);

        // Then
        assertNotNull(result);
        assertEquals(EstadoPedido.ANALISIS, result.getEstado());
        verify(pedidoRepository, times(1)).save(pedido);
    }

    @Test
    void testCambiarEstado_PedidoNoEncontrado() {
        // Given
        when(pedidoRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Pedido result = pedidoService.cambiarEstado(99L, EstadoPedido.ANALISIS);

        // Then
        assertNull(result);
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    @Test
    void testVerificarDisponibilidad_Disponible() {
        // Given
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        // When
        boolean result = pedidoService.verificarDisponibilidad(1L);

        // Then
        assertTrue(result);
    }

    @Test
    void testVerificarDisponibilidad_NoDisponible() {
        // Given
        producto.setP_stock(0);
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        // When
        boolean result = pedidoService.verificarDisponibilidad(1L);

        // Then
        assertFalse(result);
    }

    @Test
    void testGenerarFactura() {
        // Given
        pedido.setEstado(EstadoPedido.FACTURACION);
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));
        when(facturaRepository.save(any(Factura.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Factura result = pedidoService.generarFactura(1L);

        // Then
        assertNotNull(result);
        assertEquals(499.99, result.getTotal());
        assertTrue(result.getNumeroFactura().startsWith("FACT-"));
        verify(facturaRepository, times(1)).save(any(Factura.class));
    }

    @Test
    void testGenerarFactura_EstadoIncorrecto() {
        // Given
        pedido.setEstado(EstadoPedido.ANALISIS);
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        // When
        Factura result = pedidoService.generarFactura(1L);

        // Then
        assertNull(result);
        verify(facturaRepository, never()).save(any(Factura.class));
    }
}