import React from 'react';
import { Tags, Edit, Trash2, Package } from 'lucide-react';

export const CategoriaCard = ({ categoria }) => {
  return (
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
          {categoria.producto?.length || 0}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
        <button className="flex items-center text-gray-500 hover:text-gray-700 text-sm">
          <Edit className="w-4 h-4 mr-1" />
          Editar
        </button>
        <button 
          className="flex items-center text-red-500 hover:text-red-700 text-sm"
          disabled={categoria.producto?.length > 0}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Eliminar
        </button>
      </div>
    </div>
  );
};