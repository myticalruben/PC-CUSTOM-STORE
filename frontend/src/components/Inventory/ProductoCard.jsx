import React, {useState} from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import { Package, Edit, Trash2, Cpu, HardDrive, MemoryStick } from 'lucide-react';

const getProductIcon = (categoriaNombre) => {
  const icons = {
    'Procesadores': Cpu,
    'Tarjetas Gráficas': Cpu,
    'Memoria RAM': MemoryStick,
    'Almacenamiento': HardDrive,
    'Motherboards': Cpu
  };
  
  return icons[categoriaNombre] || Package;
};

export const ProductoCard = ({ producto, onEdit }) => {
  const { deleteProducto } = useInventory();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const IconComponent = getProductIcon(producto.p_categoria_id?.c_nombre);
  const isLowStock = producto.p_stock < 5;
  const isOutOfStock = producto.p_stock === 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProducto(producto.p_id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="card hover:shadow-lg transition-shadow duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconComponent className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">{producto.p_nombre}</h3>
              <p className="text-sm text-gray-500">{producto.p_codigo}</p>
            </div>
          </div>
          
          {/* Stock Status */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isOutOfStock 
              ? 'bg-red-100 text-red-800'
              : isLowStock
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {isOutOfStock ? 'Sin Stock' : `${producto.p_stock} unidades`}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Categoría:</span>
            <span className="text-gray-900 font-medium">
              {producto.p_categoria_id?.c_nombre || 'Sin categoría'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Precio:</span>
            <span className="text-gray-900 font-medium">
              ${producto.p_precio?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fecha creación:</span>
            <span className="text-gray-900">
              {new Date(producto.p_fecha_creacion).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button 
            onClick={() => onEdit(producto)}
            className="flex items-center text-blue-500 hover:text-blue-700 text-sm transition-colors duration-200"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className="flex items-center text-red-500 hover:text-red-700 text-sm transition-colors duration-200 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${producto.p_nombre}"? Esta acción no se puede deshacer.`}
        confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
        type="danger"
      />
    </>
  );
};