package com.custom.pc.service;

import com.custom.pc.model.Categoria;
import com.custom.pc.repository.CategoriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private CategoriaService categoriaService;

    private Categoria categoria;

    @BeforeEach
    void setUp() {
        categoria = new Categoria("Procesadores", "Procesadores de alta gama");
        categoria.setC_id(1L);
    }

    @Test
    void testFindAllCategorias() {
        // Given
        List<Categoria> categorias = Arrays.asList(categoria);
        when(categoriaRepository.findAll()).thenReturn(categorias);

        // When
        List<Categoria> result = categoriaService.findAllCategoria();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Procesadores", result.get(0).getC_nombre());
        verify(categoriaRepository, times(1)).findAll();
    }

    @Test
    void testSaveCategoria() {
        // Given
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        // When
        Categoria result = categoriaService.saveCategoria(categoria);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getC_id());
        assertEquals("Procesadores", result.getC_nombre());
        verify(categoriaRepository, times(1)).save(categoria);
    }

    @Test
    void testFindCategoriaById() {
        // Given
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));

        // When
        Categoria result = categoriaService.findCategoriaById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getC_id());
        verify(categoriaRepository, times(1)).findById(1L);
    }

    @Test
    void testFindCategoriaById_NotFound() {
        // Given
        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Categoria result = categoriaService.findCategoriaById(99L);

        // Then
        assertNull(result);
        verify(categoriaRepository, times(1)).findById(99L);
    }

    @Test
    void testDeleteCategoria() {
        // When
        categoriaService.deleteCategoria(1L);

        // Then
        verify(categoriaRepository, times(1)).deleteById(1L);
    }
}