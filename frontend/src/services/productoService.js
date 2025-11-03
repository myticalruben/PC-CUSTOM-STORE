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
        const response = await api.post("/inventario/productos/crear", productoData);
        return response.data;
    }
}