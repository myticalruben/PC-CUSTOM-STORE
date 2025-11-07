import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { pedidoService } from '../services/pedidosService';

// Estado inicial
const initialState = {
  pedidos: [],
  loading: false,
  error: null,
  selectedPedido: null
};

// Tipos de acciones
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_PEDIDOS: 'SET_PEDIDOS',
  SET_ERROR: 'SET_ERROR',
  SELECT_PEDIDO: 'SELECT_PEDIDO',
  UPDATE_PEDIDO: 'UPDATE_PEDIDO',
  ADD_PEDIDO: 'ADD_PEDIDO',
  DELETE_PEDIDO: 'DELETE_PEDIDO'
};

// Reducer
const pedidosReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ACTION_TYPES.SET_PEDIDOS:
      return {
        ...state,
        pedidos: action.payload,
        loading: false,
        error: null
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case ACTION_TYPES.SELECT_PEDIDO:
      return {
        ...state,
        selectedPedido: action.payload
      };

    case ACTION_TYPES.ADD_PEDIDO:
      return {
        ...state,
        pedidos: [action.payload, ...state.pedidos]
      };

    case ACTION_TYPES.UPDATE_PEDIDO:
      { const updatedPedidos = state.pedidos.map(pedido =>
        pedido.id === action.payload.id ? { ...pedido, ...action.payload } : pedido
      );
      return {
        ...state,
        pedidos: updatedPedidos,
        selectedPedido: 
          state.selectedPedido?.id === action.payload.id 
            ? { ...state.selectedPedido, ...action.payload }
            : state.selectedPedido
      }; }

    case ACTION_TYPES.DELETE_PEDIDO:
      return {
        ...state,
        pedidos: state.pedidos.filter(pedido => pedido.id !== action.payload),
        selectedPedido: 
          state.selectedPedido?.id === action.payload 
            ? null 
            : state.selectedPedido
      };

    default:
      return state;
  }
};

// Crear contexto
const PedidosContext = createContext();

// Hook personalizado
export const usePedidos = () => {
  const context = useContext(PedidosContext);
  if (!context) {
    throw new Error('usePedidos debe ser usado dentro de un PedidosProvider');
  }
  return context;
};

// Provider
export const PedidosProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pedidosReducer, initialState);

  // Acciones
  const actions = {
    // Cargar todos los pedidos
    fetchPedidos: async () => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        const pedidos = await pedidoService.getAllPedidos();
        // Asegurarnos de que los pedidos tengan el formato correcto
        const pedidosFormateados = pedidos.map(pedido => ({
          ...pedido,
          componentes: pedido.componentes || [],
          fechaCreacion: pedido.fechaCreacion || pedido.fecha_creacion,
          fechaActualizacion: pedido.fechaActualizacion || pedido.fecha_actualizacion
        }));
        dispatch({ type: ACTION_TYPES.SET_PEDIDOS, payload: pedidosFormateados });
      } catch (error) {
        console.error('Error fetching pedidos:', error);
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: 'Error al cargar los pedidos' 
        });
      }
    },

    // Crear nuevo pedido
    createPedido: async (pedidoData) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        const nuevoPedido = await pedidoService.createPedido(pedidoData);
        dispatch({ type: ACTION_TYPES.ADD_PEDIDO, payload: nuevoPedido });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        return nuevoPedido;
      } catch (error) {
        console.error('Error creating pedido:', error);
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: 'Error al crear el pedido' 
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        throw error;
      }
    },

    // Actualizar estado del pedido
    updatePedidoEstado: async (pedidoId, nuevoEstado) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        console.log('Actualizando estado:', pedidoId, nuevoEstado);
        
        // Llamar al servicio para actualizar el estado
        const pedidoActualizado = await pedidoService.updateEstado(pedidoId, nuevoEstado);
        
        console.log('Pedido actualizado:', pedidoActualizado);
        
        // Actualizar el estado local
        dispatch({ 
          type: ACTION_TYPES.UPDATE_PEDIDO, 
          payload: {
            id: pedidoId,
            estado: nuevoEstado,
            fechaActualizacion: new Date().toISOString()
          }
        });
        
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        return pedidoActualizado;
      } catch (error) {
        console.error('Error updating pedido estado:', error);
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: 'Error al actualizar el estado del pedido' 
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        throw error;
      }
    },

    // Verificar disponibilidad
    verificarDisponibilidad: async (pedidoId) => {
      try {
        const disponible = await pedidoService.verificarDisponibilidad(pedidoId);
        return disponible;
      } catch (error) {
        console.error('Error verificando disponibilidad:', error);
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: 'Error al verificar disponibilidad' 
        });
        throw error;
      }
    },

    // Generar factura
    generarFactura: async (pedidoId) => {
      try {
        const factura = await pedidoService.generarFactura(pedidoId);
        
        // Actualizar el estado del pedido a COMPLETADO después de facturar
        if (factura) {
          dispatch({ 
            type: ACTION_TYPES.UPDATE_PEDIDO, 
            payload: {
              id: pedidoId,
              estado: 'COMPLETADO',
              fechaActualizacion: new Date().toISOString(),
              factura: factura
            }
          });
        }
        
        return factura;
      } catch (error) {
        console.error('Error generando factura:', error);
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: 'Error al generar la factura' 
        });
        throw error;
      }
    },

    // Seleccionar pedido
    selectPedido: (pedido) => {
      dispatch({ type: ACTION_TYPES.SELECT_PEDIDO, payload: pedido });
    },

    // Limpiar selección
    clearSelectedPedido: () => {
      dispatch({ type: ACTION_TYPES.SELECT_PEDIDO, payload: null });
    },

    // Limpiar error
    clearError: () => {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: null });
    },

    // Actualizar pedido completo
    updatePedido: async (pedidoId, pedidoData) => {
      try {
        const pedidoActualizado = await pedidoService.updatePedido(pedidoId, pedidoData);
        dispatch({ type: ACTION_TYPES.UPDATE_PEDIDO, payload: pedidoActualizado });
        return pedidoActualizado;
      } catch (error) {
        console.error('Error updating pedido:', error);
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: 'Error al actualizar el pedido' 
        });
        throw error;
      }
    },

    // Eliminar pedido
    deletePedido: async (pedidoId) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        await pedidoService.deletePedido(pedidoId);
        dispatch({ type: ACTION_TYPES.DELETE_PEDIDO, payload: pedidoId });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
      } catch (error) {
        console.error('Error deleting pedido:', error);
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: 'Error al eliminar el pedido' 
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        throw error;
      }
    }
  };

  // Cargar pedidos al inicializar
  useEffect(() => {
    actions.fetchPedidos();
  }, []);

  const value = {
    // Estado
    pedidos: state.pedidos,
    loading: state.loading,
    error: state.error,
    selectedPedido: state.selectedPedido,
    
    // Acciones
    ...actions
  };

  return (
    <PedidosContext.Provider value={value}>
      {children}
    </PedidosContext.Provider>
  );
};