import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ProductoCard } from './ProductoCard';
import { CategoriaCard } from './CategoriaCard';
import { StockAlert } from './StockAlert';
import { ProductoForm } from './ProductoForm';
import { CategoriaForm } from './CategoriaForm';
import { Plus, Package, Tags, AlertTriangle, X } from 'lucide-react';

export const InventoryPanel = () => {
  const { productos, categorias, loading, error, stats } = useInventory();
  const [activeTab, setActiveTab] = useState('productos');
  const [showLowStock, setShowLowStock] = useState(false);
  const [showProductoForm, setShowProductoForm] = useState(false);
  const [showCategoriaForm, setShowCategoriaForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [editingCategoria, setEditingCategoria] = useState(null);

  // Filtrar productos con stock bajo
  const lowStockProducts = productos.filter(producto => producto.p_stock < 5);

  // Productos a mostrar según filtro
  const displayedProducts = showLowStock ? lowStockProducts : productos;

  // Handlers para formularios de productos
  const handleNewProducto = () => {
    setEditingProducto(null);
    setShowProductoForm(true);
  };

  const handleEditProducto = (producto) => {
    setEditingProducto(producto);
    setShowProductoForm(true);
  };

  const handleCloseProductoForm = () => {
    setShowProductoForm(false);
    setEditingProducto(null);
  };

  // Handlers para formularios de categorías
  const handleNewCategoria = () => {
    setEditingCategoria(null);
    setShowCategoriaForm(true);
  };

  const handleEditCategoria = (categoria) => {
    setEditingCategoria(categoria);
    setShowCategoriaForm(true);
  };

  const handleCloseCategoriaForm = () => {
    setShowCategoriaForm(false);
    setEditingCategoria(null);
  };

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

        {/* Botones de acción según tab activo */}
        {activeTab === 'productos' && (
          <button
            onClick={handleNewProducto}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Producto
          </button>
        )}

        {activeTab === 'categorias' && (
          <button
            onClick={handleNewCategoria}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Categoría
          </button>
        )}
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{stats.totalProductos}</div>
          <div className="text-sm text-gray-500">Total Productos</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">{stats.totalCategorias}</div>
          <div className="text-sm text-gray-500">Categorías</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">{stats.lowStockCount}</div>
          <div className="text-sm text-gray-500">Stock Bajo</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-green-600">${stats.totalValue}</div>
          <div className="text-sm text-gray-500">Valor Total</div>
        </div>
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
            className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'productos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Package className="w-5 h-5 mr-2" />
            Productos ({productos.length})
          </button>
          <button
            onClick={() => setActiveTab('categorias')}
            className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'categorias'
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
              <ProductoCard
                key={producto.p_id}
                producto={producto}
                onEdit={handleEditProducto}
              />
            ))}
          </div>
        )}

        {activeTab === 'categorias' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((categoria) => (
              <CategoriaCard
                key={categoria.c_id}
                categoria={categoria}
                onEdit={handleEditCategoria}
              />
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
          <button
            onClick={handleNewProducto}
            className="btn-primary mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Producto
          </button>
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
          <button
            onClick={handleNewCategoria}
            className="btn-primary mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primera Categoría
          </button>
        </div>
      )}

      {/* Modales de Formularios */}
      {showProductoForm && (
        <ProductoForm
          producto={editingProducto}
          onClose={handleCloseProductoForm}
          categorias={categorias}
        />
      )}

      {showCategoriaForm && (
        <CategoriaForm
          categoria={editingCategoria}
          onClose={handleCloseCategoriaForm}
        />
      )}
    </div>
  );
};