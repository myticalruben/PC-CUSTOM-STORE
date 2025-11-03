import api from "./api";

export const pedidoService = {

    // Obtenemos todos los pedidos
    getAllPedidos: async () =>{
        const response = await api.get("/pedidos");
        return response.data;
    },

    // Obtenemos un pedido por ID
    getPedidoById: async (id) =>{
        const response = await api.get(`/pedidos/${id}`);
        return response.data;
    },

    // Creamos un nuevo pedido
    createPedido: async (pedidoData) =>{
        const response = await api.post("/pedidos", pedidoData);
        return response.data;
    },

    updateEstado: async (id, estado) =>{
        const response = await api.patch(`/pedidos/${id}/estado`, { estado });
        return response.data;
    },

    verificarDisponibilidad: async (id) =>{
        const response = await api.get(`/pedidos/${id}/verificar-disponibilidad`);
        return response.data;
    },

    generarFactura: async (id) =>{
        const response = await api.get(`/pedidos/${id}/generar-factura`);
        return response.data;
    }
};