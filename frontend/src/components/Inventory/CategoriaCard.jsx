import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import { Tags, Edit, Trash2, Package } from 'lucide-react';

export const CategoriaCard = ({ categoria, onEdit }) => {
  const { deleteCategoria } = useInventory();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const productoCount = categoria.producto?.length || 0;
  const canDelete = productoCount === 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCategoria(categoria.c_id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDeleteMessage = () => {
    if (productoCount > 0) {
      return `No se puede eliminar la categoría "${categoria.c_nombre}" porque tiene ${productoCount} producto(s) asociado(s). Primero mueve o elimina los productos de esta categoría.`;
    }
    return `¿Estás seguro de que deseas eliminar la categoría "${categoria.c_nombre}"? Esta acción no se puede deshacer.`;
  };

  return (
    <>
      <div className="card hover:shadow-lg transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Tags className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">{categoria.c_nombre}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {categoria.c_descripcion || 'Sin descripción'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-1" />
            Productos
          </div>
          <span className="font-semibold text-gray-900">
            {productoCount}
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
          <button 
            onClick={() => onEdit(categoria)}
            className="flex items-center text-blue-500 hover:text-blue-700 text-sm transition-colors duration-200"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)}
            disabled={!canDelete || isDeleting}
            className={`flex items-center text-sm transition-colors duration-200 ${
              canDelete 
                ? 'text-red-500 hover:text-red-700' 
                : 'text-gray-400 cursor-not-allowed'
            } disabled:opacity-50`}
            title={!canDelete ? 'No se puede eliminar categorías con productos' : ''}
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
        onConfirm={canDelete ? handleDelete : undefined}
        title={canDelete ? "Eliminar Categoría" : "No se puede eliminar"}
        message={getDeleteMessage()}
        confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
        cancelText="Cerrar"
        type={canDelete ? "danger" : "warning"}
      />
    </>
  );
};