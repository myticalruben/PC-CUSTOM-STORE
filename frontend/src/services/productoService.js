import api from "./api";

export const productoService = {
    getAllProductos: async () => {
        const response = await api.get("/inventario/productos/listar");
        return response.data;
    },

    getProductoById: async (id) => {
        const response = await api.get(`/inventario/productos/${id}`);
        return response.data;
    },

    getProductosByCategoria: async (categoria) => {
        const response = await api.get(`/inventario/productos/listar/categorias/${categoria}`);
        return response.data;
    },

    createProducto: async (productoData) => {
        const response = await api.post("/inventario/productos/agregar", productoData);
        return response.data;
    },
    actualizarProducto: async (id, actualizarData) => {
        const response = await api.put(`/inventario/productos/actualizar/${id}`, actualizarData);
        return response.data;
    },
    deleteProducto: async (id) => {
        const response = await api.delete(`/inventario/productos/eliminar/${id}`);
        return response.data;
    }
}