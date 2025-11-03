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
      return {
        ...state,
        pedidos: state.pedidos.map(pedido =>
          pedido.id === action.payload.id ? action.payload : pedido
        ),
        selectedPedido: 
          state.selectedPedido?.id === action.payload.id 
            ? action.payload 
            : state.selectedPedido
      };

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
        dispatch({ type: ACTION_TYPES.SET_PEDIDOS, payload: pedidos });
      } catch (error) {
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
        return nuevoPedido;
      } catch (error) {
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: 'Error al crear el pedido' 
        });
        throw error;
      }
    },

    // Actualizar estado del pedido
    updatePedidoEstado: async (pedidoId, nuevoEstado) => {
      try {
        const pedidoActualizado = await pedidoService.updateEstado(pedidoId, nuevoEstado);
        dispatch({ type: ACTION_TYPES.UPDATE_PEDIDO, payload: pedidoActualizado });
        return pedidoActualizado;
      } catch (error) {
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: 'Error al actualizar el estado del pedido' 
        });
        throw error;
      }
    },

    // Verificar disponibilidad
    verificarDisponibilidad: async (pedidoId) => {
      try {
        const disponible = await pedidoService.verificarDisponibilidad(pedidoId);
        return disponible;
      } catch (error) {
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
        return factura;
      } catch (error) {
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