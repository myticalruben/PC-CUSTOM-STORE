import api from './api';

export const categoriaService = {
  // Obtener todas las categorías
  getAllCategorias: async () => {
    const response = await api.get('/inventario/categorias/listar');
    return response.data;
  },

  // Obtener categoría por ID
  getCategoriaById: async (id) => {
    const response = await api.get(`/inventario/categorias/listar/${id}`);
    return response.data;
  },

  // Crear nueva categoría
  createCategoria: async (categoriaData) => {
    const response = await api.post('/inventario/categorias/agregar', categoriaData);
    return response.data;
  },

  deleteCategoria: async (id) => {
    const response = await api.delete(`/inventario/categorias/eliminar/${id}`);
    return response.data;
  }
};