import React, { useState, useMemo } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, Minus, Search, Package } from 'lucide-react';

export const ComponenteSelector = ({ componentes, onChange, error }) => {
  const { productos, categorias } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Productos filtrados
  const productosFiltrados = useMemo(() => {
    let filtered = productos;

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(
        producto => producto.p_categoria_id?.c_id === parseInt(selectedCategory)
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        producto =>
          producto.p_nombre.toLowerCase().includes(term) ||
          producto.p_codigo.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [productos, selectedCategory, searchTerm]);

  // Agregar componente
  const agregarComponente = (producto) => {
    const existe = componentes.find(comp => comp.producto.p_id === producto.p_id);
    
    if (existe) {
      // Incrementar cantidad si ya existe
      const nuevosComponentes = componentes.map(comp =>
        comp.producto.p_id === producto.p_id
          ? { ...comp, cantidad: comp.cantidad + 1 }
          : comp
      );
      onChange(nuevosComponentes);
    } else {
      // Agregar nuevo componente
      onChange([
        ...componentes,
        {
          producto,
          cantidad: 1,
          notas: ''
        }
      ]);
    }
  };

  // Actualizar cantidad
  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const nuevosComponentes = componentes.map(comp =>
      comp.producto.p_id === productoId
        ? { ...comp, cantidad: nuevaCantidad }
        : comp
    );
    onChange(nuevosComponentes);
  };

  // Eliminar componente
  const eliminarComponente = (productoId) => {
    const nuevosComponentes = componentes.filter(
      comp => comp.producto.p_id !== productoId
    );
    onChange(nuevosComponentes);
  };

  // Actualizar notas
  const actualizarNotas = (productoId, notas) => {
    const nuevosComponentes = componentes.map(comp =>
      comp.producto.p_id === productoId
        ? { ...comp, notas }
        : comp
    );
    onChange(nuevosComponentes);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Selección de Componentes
      </h2>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtro por categoría */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(categoria => (
            <option key={categoria.c_id} value={categoria.c_id}>
              {categoria.c_nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Componentes Seleccionados */}
      {componentes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Componentes Seleccionados ({componentes.length})
          </h3>
          <div className="space-y-3">
            {componentes.map((componente) => (
              <div
                key={componente.producto.p_id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {componente.producto.p_nombre}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ${componente.producto.p_precio} x {componente.cantidad} = 
                        <span className="font-semibold text-blue-600 ml-1">
                          ${(componente.producto.p_precio * componente.cantidad).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => actualizarCantidad(componente.producto.p_id, componente.cantidad - 1)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {componente.cantidad}
                      </span>
                      
                      <button
                        onClick={() => actualizarCantidad(componente.producto.p_id, componente.cantidad + 1)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => eliminarComponente(componente.producto.p_id)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Notas (opcional)"
                    value={componente.notas}
                    onChange={(e) => actualizarNotas(componente.producto.p_id, e.target.value)}
                    className="w-full mt-2 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Lista de Productos Disponibles */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Productos Disponibles
        </h3>
        
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.p_id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {producto.p_nombre}
                    </h4>
                    <p className="text-sm text-gray-500">{producto.p_codigo}</p>
                    <p className="text-sm text-gray-500">
                      {producto.p_categoria_id?.c_nombre}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      ${producto.p_precio}
                    </p>
                    <p className={`text-xs ${
                      producto.p_stock < 5 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                    }`}>
                      Stock: {producto.p_stock}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => agregarComponente(producto)}
                  disabled={producto.p_stock === 0}
                  className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-200 ${
                    producto.p_stock === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {producto.p_stock === 0 ? 'Sin Stock' : 'Agregar al Pedido'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};