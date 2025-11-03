import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInvetory';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ProductoCard } from './ProductoCard';
import { CategoriaCard } from './CategoriaCard';
import { StockAlert } from './StockAlert';
import { Plus, Package, Tags, AlertTriangle } from 'lucide-react';

export const InventoryPanel = () => {
  const { productos, categorias, loading, error } = useInventory();
  const [activeTab, setActiveTab] = useState('productos');
  const [showLowStock, setShowLowStock] = useState(false);

  // Filtrar productos con stock bajo
  const lowStockProducts = productos.filter(producto => producto.p_stock < 5);
  
  // Productos a mostrar según filtro
  const displayedProducts = showLowStock ? lowStockProducts : productos;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center text-red-800">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600 mt-2">
            Gestiona productos, categorías y controla el stock disponible
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Agregar Producto
        </button>
      </div>

      {/* Alertas de Stock Bajo */}
      {lowStockProducts.length > 0 && (
        <StockAlert 
          count={lowStockProducts.length} 
          products={lowStockProducts}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('productos')}
            className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'productos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="w-5 h-5 mr-2" />
            Productos ({productos.length})
          </button>
          <button
            onClick={() => setActiveTab('categorias')}
            className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categorias'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Tags className="w-5 h-5 mr-2" />
            Categorías ({categorias.length})
          </button>
        </nav>
      </div>

      {/* Filtros para Productos */}
      {activeTab === 'productos' && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Mostrar solo stock bajo ({lowStockProducts.length})
              </span>
            </label>
          </div>
          
          <div className="text-sm text-gray-500">
            Mostrando {displayedProducts.length} de {productos.length} productos
          </div>
        </div>
      )}

      {/* Contenido de Tabs */}
      <div className="mt-6">
        {activeTab === 'productos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((producto) => (
              <ProductoCard key={producto.p_id} producto={producto} />
            ))}
          </div>
        )}

        {activeTab === 'categorias' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((categoria) => (
              <CategoriaCard key={categoria.c_id} categoria={categoria} />
            ))}
          </div>
        )}
      </div>

      {/* Empty States */}
      {activeTab === 'productos' && displayedProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {showLowStock ? 'No hay productos con stock bajo' : 'No hay productos'}
          </h3>
          <p className="text-gray-500">
            {showLowStock 
              ? 'Todos los productos tienen stock suficiente'
              : 'Comienza agregando productos al inventario'
            }
          </p>
        </div>
      )}

      {activeTab === 'categorias' && categorias.length === 0 && (
        <div className="text-center py-12">
          <Tags className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay categorías
          </h3>
          <p className="text-gray-500">
            Comienza creando categorías para organizar tus productos
          </p>
        </div>
      )}
    </div>
  );
};