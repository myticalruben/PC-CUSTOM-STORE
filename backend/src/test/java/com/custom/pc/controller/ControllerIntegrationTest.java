package com.custom.pc.controller;

import com.custom.pc.model.Categoria;
import com.custom.pc.model.Producto;
import com.custom.pc.service.CategoriaService;
import com.custom.pc.service.ProductoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {CategoriaController.class, ProductoController.class})
public class ControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CategoriaService categoriaService;

    @MockBean
    private ProductoService productoService;

    @Test
    void testGetAllCategorias() throws Exception {
        // Given
        Categoria categoria = new Categoria("Procesadores", "Descripción");
        categoria.setC_id(1L);
        List<Categoria> categorias = Arrays.asList(categoria);

        when(categoriaService.findAllCategoria()).thenReturn(categorias);

        // When & Then
        mockMvc.perform(get("/api/inventario/categorias/listar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].c_id").value(1L))
                .andExpect(jsonPath("$[0].c_nombre").value("Procesadores"));
    }

    @Test
    void testCreateCategoria() throws Exception {
        // Given
        Categoria categoria = new Categoria("Procesadores", "Descripción");
        categoria.setC_id(1L);

        when(categoriaService.saveCategoria(any(Categoria.class))).thenReturn(categoria);

        // When & Then
        mockMvc.perform(post("/api/inventario/categorias/agregar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoria)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.c_id").value(1L))
                .andExpect(jsonPath("$.c_nombre").value("Procesadores"));
    }

    @Test
    void testGetAllProductos() throws Exception {
        // Given
        Categoria categoria = new Categoria("Procesadores", "Descripción");
        Producto producto = new Producto("Intel i9", "CODE1", 499.99, 10, LocalDate.now(), categoria);
        producto.setP_id(1L);
        List<Producto> productos = Arrays.asList(producto);

        when(productoService.findAllProducto()).thenReturn(productos);

        // When & Then
        mockMvc.perform(get("/api/inventario/productos/listar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].p_id").value(1L))
                .andExpect(jsonPath("$[0].p_nombre").value("Intel i9"));
    }

    @Test
    void testGetProductosByCategoria() throws Exception {
        // Given
        Categoria categoria = new Categoria("Procesadores", "Descripción");
        Producto producto = new Producto("Intel i9", "CODE1", 499.99, 10, LocalDate.now(), categoria);
        producto.setP_id(1L);
        List<Producto> productos = Arrays.asList(producto);

        when(productoService.findByPCategoriaId_CId(1L)).thenReturn(productos);

        // When & Then
        mockMvc.perform(get("/api/inventario/productos/listar/categorias/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].p_id").value(1L))
                .andExpect(jsonPath("$[0].p_nombre").value("Intel i9"));
    }
}