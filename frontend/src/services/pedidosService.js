import api from './api';

export const pedidoService = {
  // Obtener todos los pedidos
  getAllPedidos: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  // Obtener pedido por ID
  getPedidoById: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  // Crear nuevo pedido
  createPedido: async (pedidoData) => {
    const response = await api.post('/pedidos', pedidoData);
    return response.data;
  },

  // Cambiar estado del pedido
  updateEstado: async (id, nuevoEstado) => {
    // Enviar el estado como string en el body
    const response = await api.put(`/pedidos/${id}/estado`, nuevoEstado, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Verificar disponibilidad
  verificarDisponibilidad: async (id) => {
    const response = await api.get(`/pedidos/${id}/verificar-disponibilidad`);
    return response.data;
  },

  // Generar factura
  generarFactura: async (id) => {
    const response = await api.post(`/pedidos/${id}/facturar`);
    return response.data;
  },

  // Actualizar pedido completo
  updatePedido: async (id, pedidoData) => {
    const response = await api.put(`/pedidos/${id}`, pedidoData);
    return response.data;
  },

  // Eliminar pedido
  deletePedido: async (id) => {
    await api.delete(`/pedidos/${id}`);
  }
};