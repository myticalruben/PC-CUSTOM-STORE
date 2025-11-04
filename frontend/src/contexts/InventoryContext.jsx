import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { productoService, categoriaService } from '../services';

// Estado inicial
const initialState = {
  productos: [],
  categorias: [],
  loading: false,
  error: null,
  selectedProducto: null,
  selectedCategoria: null,
  filters: {
    categoria: null,
    lowStockOnly: false,
    searchTerm: ''
  }
};

// Tipos de acciones
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTOS: 'SET_PRODUCTOS',
  SET_CATEGORIAS: 'SET_CATEGORIAS',
  SET_ERROR: 'SET_ERROR',
  SELECT_PRODUCTO: 'SELECT_PRODUCTO',
  SELECT_CATEGORIA: 'SELECT_CATEGORIA',
  UPDATE_PRODUCTO: 'UPDATE_PRODUCTO',
  UPDATE_CATEGORIA: 'UPDATE_CATEGORIA',
  ADD_PRODUCTO: 'ADD_PRODUCTO',
  ADD_CATEGORIA: 'ADD_CATEGORIA',
  DELETE_PRODUCTO: 'DELETE_PRODUCTO',
  DELETE_CATEGORIA: 'DELETE_CATEGORIA',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS'
};

// Reducer
const inventoryReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ACTION_TYPES.SET_PRODUCTOS:
      return {
        ...state,
        productos: action.payload,
        loading: false,
        error: null
      };

    case ACTION_TYPES.SET_CATEGORIAS:
      return {
        ...state,
        categorias: action.payload,
        loading: false,
        error: null
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case ACTION_TYPES.SELECT_PRODUCTO:
      return {
        ...state,
        selectedProducto: action.payload
      };

    case ACTION_TYPES.SELECT_CATEGORIA:
      return {
        ...state,
        selectedCategoria: action.payload
      };

    case ACTION_TYPES.ADD_PRODUCTO:
      return {
        ...state,
        productos: [action.payload, ...state.productos]
      };

    case ACTION_TYPES.ADD_CATEGORIA:
      return {
        ...state,
        categorias: [action.payload, ...state.categorias]
      };

    case ACTION_TYPES.UPDATE_PRODUCTO:
      return {
        ...state,
        productos: state.productos.map(producto =>
          producto.p_id === action.payload.p_id ? action.payload : producto
        ),
        selectedProducto:
          state.selectedProducto?.p_id === action.payload.p_id
            ? action.payload
            : state.selectedProducto
      };

    case ACTION_TYPES.UPDATE_CATEGORIA:
      return {
        ...state,
        categorias: state.categorias.map(categoria =>
          categoria.c_id === action.payload.c_id ? action.payload : categoria
        ),
        selectedCategoria:
          state.selectedCategoria?.c_id === action.payload.c_id
            ? action.payload
            : state.selectedCategoria
      };

    case ACTION_TYPES.DELETE_PRODUCTO:
      return {
        ...state,
        productos: state.productos.filter(producto => producto.p_id !== action.payload),
        selectedProducto:
          state.selectedProducto?.p_id === action.payload
            ? null
            : state.selectedProducto
      };

    case ACTION_TYPES.DELETE_CATEGORIA:
      return {
        ...state,
        categorias: state.categorias.filter(categoria => categoria.c_id !== action.payload),
        selectedCategoria:
          state.selectedCategoria?.c_id === action.payload
            ? null
            : state.selectedCategoria
      };

    case ACTION_TYPES.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case ACTION_TYPES.CLEAR_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };

    default:
      return state;
  }
};

// Crear contexto
const InventoryContext = createContext();

// Hook personalizado
// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory debe ser usado dentro de un InventoryProvider');
  }
  return context;
};

// Provider
export const InventoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  // Acciones
  const actions = {
    // Cargar todos los datos del inventario
    fetchInventory: async () => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        const [productos, categorias] = await Promise.all([
          productoService.getAllProductos(),
          categoriaService.getAllCategorias()
        ]);

        dispatch({ type: ACTION_TYPES.SET_PRODUCTOS, payload: productos });
        dispatch({ type: ACTION_TYPES.SET_CATEGORIAS, payload: categorias });
      } catch{
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: 'Error al cargar el inventario'
        });
      }
    },

    // Crear nuevo producto
    createProducto: async (productoData) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        const nuevoProducto = await productoService.createProducto(productoData);
        dispatch({ type: ACTION_TYPES.ADD_PRODUCTO, payload: nuevoProducto });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false }); // ← AÑADIR ESTA LÍNEA
        return nuevoProducto;
      } catch (error) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: 'Error al crear el producto'
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false }); // ← AÑADIR ESTA LÍNEA
        throw error;
      }
    },

    // Crear nueva categoría
    createCategoria: async (categoriaData) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        const nuevaCategoria = await categoriaService.createCategoria(categoriaData);
        dispatch({ type: ACTION_TYPES.ADD_CATEGORIA, payload: nuevaCategoria });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false }); // ← AÑADIR ESTA LÍNEA
        return nuevaCategoria;
      } catch (error) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: 'Error al crear la categoría'
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false }); // ← AÑADIR ESTA LÍNEA
        throw error;
      }
    },

    // Actualizar producto
    updateProducto: async (productoId, productoData) => {
      try {
        // En una implementación real, llamarías al servicio de actualización
        const productoActualizado = { ...productoData, p_id: productoId };
        const prod = await productoService.actualizarProducto(productoId,productoActualizado);
        dispatch({ type: ACTION_TYPES.UPDATE_PRODUCTO, payload: prod });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        return prod;
      } catch (error) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: 'Error al actualizar el producto'
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        throw error;
      }
    },

    // Actualizar categoría
    updateCategoria: async (categoriaId, categoriaData) => {
      try {
        // En una implementación real, llamarías al servicio de actualización
        const categoriaActualizada = { ...categoriaData, c_id: categoriaId };
        const update = await categoriaService.createCategoria(categoriaActualizada)
        dispatch({ type: ACTION_TYPES.UPDATE_CATEGORIA, payload: update });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        return update;
      } catch (error) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: 'Error al actualizar la categoría'
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        throw error;
      }
    },

    // Eliminar producto
    deleteProducto: async (productoId) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        // En una implementación real, esto llamaría a productoService.deleteProducto()
        const deleteProducto = await productoService.deleteProducto(productoId);
        dispatch({ type: ACTION_TYPES.DELETE_PRODUCTO, payload: productoId });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        return deleteProducto
      } catch (error) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: 'Error al eliminar el producto'
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        throw error;
      }
    },

    // Eliminar categoría
    deleteCategoria: async (categoriaId) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        // Verificar si la categoría tiene productos asociados
        const deleteCategoria = await categoriaService.deleteCategoria(categoriaId);
        const productosEnCategoria = state.productos.filter(
          producto => producto.p_categoria_id?.c_id === categoriaId
        );

        if (productosEnCategoria.length > 0) {
          throw new Error('No se puede eliminar una categoría que tiene productos asociados');
        }

        // En una implementación real, esto llamaría a categoriaService.deleteCategoria()
        dispatch({ type: ACTION_TYPES.DELETE_CATEGORIA, payload: categoriaId });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        return deleteCategoria
      } catch (error) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: error.message || 'Error al eliminar la categoría'
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        throw error;
      }
    },

    // Seleccionar producto
    selectProducto: (producto) => {
      dispatch({ type: ACTION_TYPES.SELECT_PRODUCTO, payload: producto });
    },

    // Seleccionar categoría
    selectCategoria: (categoria) => {
      dispatch({ type: ACTION_TYPES.SELECT_CATEGORIA, payload: categoria });
    },

    // Aplicar filtros
    setFilters: (filters) => {
      dispatch({ type: ACTION_TYPES.SET_FILTERS, payload: filters });
    },

    // Limpiar filtros
    clearFilters: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_FILTERS });
    },

    // Limpiar error
    clearError: () => {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: null });
    },

    // Limpiar selecciones
    clearSelections: () => {
      dispatch({ type: ACTION_TYPES.SELECT_PRODUCTO, payload: null });
      dispatch({ type: ACTION_TYPES.SELECT_CATEGORIA, payload: null });
    }
  };

  // Productos filtrados (computed property)
  const productosFiltrados = React.useMemo(() => {
    let filtered = state.productos;

    // Filtrar por categoría
    if (state.filters.categoria) {
      filtered = filtered.filter(
        producto => producto.p_categoria_id?.c_id === state.filters.categoria
      );
    }

    // Filtrar por stock bajo
    if (state.filters.lowStockOnly) {
      filtered = filtered.filter(producto => producto.p_stock < 5);
    }

    // Filtrar por término de búsqueda
    if (state.filters.searchTerm) {
      const term = state.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        producto =>
          producto.p_nombre.toLowerCase().includes(term) ||
          producto.p_codigo.toLowerCase().includes(term) ||
          producto.p_categoria_id?.c_nombre.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [state.productos, state.filters]);

  // Estadísticas (computed properties)
  const stats = React.useMemo(() => {
    const totalProductos = state.productos.length;
    const totalCategorias = state.categorias.length;
    const lowStockCount = state.productos.filter(p => p.p_stock < 5).length;
    const outOfStockCount = state.productos.filter(p => p.p_stock === 0).length;
    const totalValue = state.productos.reduce(
      (sum, producto) => sum + (producto.p_precio * producto.p_stock),
      0
    );

    return {
      totalProductos,
      totalCategorias,
      lowStockCount,
      outOfStockCount,
      totalValue: totalValue.toFixed(2)
    };
  }, [state.productos, state.categorias]);

  // Cargar inventario al inicializar
  useEffect(() => {
    actions.fetchInventory();
  }, []);

  const value = {
    // Estado
    productos: state.productos,
    categorias: state.categorias,
    productosFiltrados,
    loading: state.loading,
    error: state.error,
    selectedProducto: state.selectedProducto,
    selectedCategoria: state.selectedCategoria,
    filters: state.filters,
    stats,

    // Acciones
    ...actions
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};