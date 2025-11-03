package com.custom.pc.service;

import com.custom.pc.model.Categoria;
import com.custom.pc.model.Producto;
import com.custom.pc.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

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
    }

    @Test
    void testFindAllProductos() {
        // Ponemos los productos en una lista
        List<Producto> productos = Arrays.asList(producto);
        
        // 
        when(productoRepository.findAll()).thenReturn(productos);

        // When
        List<Producto> result = productoService.findAllProducto();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Intel i9", result.get(0).getP_nombre());
        verify(productoRepository, times(1)).findAll();
    }

    @Test
    void testFindProductoById() {
        // Given
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        // When
        Producto result = productoService.findProductoById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getP_id());
        assertEquals("Intel i9", result.getP_nombre());
        verify(productoRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByPCategoriaId() {
        // Given
        List<Producto> productos = Arrays.asList(producto);
        when(productoRepository.buscaProductoPorCategoriaId(1L)).thenReturn(productos);

        // When
        List<Producto> result = productoService.findByPCategoriaId_CId(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Intel i9", result.get(0).getP_nombre());
        verify(productoRepository, times(1)).buscaProductoPorCategoriaId(1L);
    }

    @Test
    void testSaveProducto() {
        // Given
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        // When
        Producto result = productoService.saveProducto(producto);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getP_id());
        assertEquals("Intel i9", result.getP_nombre());
        verify(productoRepository, times(1)).save(producto);
    }

    @Test
    void testDeleteProducto() {
        // When
        productoService.deleteProducto(1L);

        // Then
        verify(productoRepository, times(1)).deleteById(1L);
    }
}