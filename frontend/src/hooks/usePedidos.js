import { useState, useEffect } from 'react';
import { pedidoService } from '../services/pedidoService';

export const usePedidos = () => {

    // variables de estado
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener todos los pedidos
    const fetchPedidos = async () => {
        try {
            setLoading(true);
            const data = await pedidoService.getAllPedidos();
            setPedidos(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los pedidos');
            console.error('Error fetching pedidos:', err);
        } finally {
            setLoading(false);
        }
    };

    // Función para crear un nuevo pedido
    const crearPedido = async (pedidoData) => {
        try {
            const nuevoPedido = await pedidoService.createPedido(pedidoData);
            setPedidos(prev => [nuevoPedido, ...prev]);
            return nuevoPedido;
        } catch (err) {
            setError('Error al crear el pedido');
            throw err;
        }
    };

    // Función para actualizar el estado de un pedido
    const actualizarEstado = async (pedidoId, nuevoEstado) => {
        try {
            const pedidoActualizado = await pedidoService.updateEstado(pedidoId, nuevoEstado);
            setPedidos(prev =>
                prev.map(pedido =>
                    pedido.id === pedidoId ? pedidoActualizado : pedido
                )
            );
            return pedidoActualizado;
        } catch (err) {
            setError('Error al actualizar el estado');
            throw err;
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    return {
        pedidos,
        loading,
        error,
        fetchPedidos,
        crearPedido,
        actualizarEstado
    };
};