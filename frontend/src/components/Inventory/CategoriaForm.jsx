import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { X, Tags, FileText } from 'lucide-react';

export const CategoriaForm = ({ categoria, onClose }) => {
  const { createCategoria, updateCategoria } = useInventory();
  
  const [formData, setFormData] = useState({
    c_nombre: '',
    c_descripcion: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!categoria;

  // Cargar datos si está editando
  useEffect(() => {
    if (categoria) {
      setFormData({
        c_nombre: categoria.c_nombre || '',
        c_descripcion: categoria.c_descripcion || ''
      });
    }
  }, [categoria]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.c_nombre.trim()) {
      newErrors.c_nombre = 'El nombre de la categoría es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio de campos
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateCategoria(categoria.c_id, formData);
      } else {
        await createCategoria(formData);
      }

      onClose();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setErrors({ submit: 'Error al guardar la categoría' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Tags className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Tags className="w-4 h-4 mr-2" />
                Nombre de la Categoría *
              </div>
            </label>
            <input
              type="text"
              value={formData.c_nombre}
              onChange={(e) => handleChange('c_nombre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.c_nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Procesadores, Tarjetas Gráficas..."
            />
            {errors.c_nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.c_nombre}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Descripción
              </div>
            </label>
            <textarea
              value={formData.c_descripcion}
              onChange={(e) => handleChange('c_descripcion', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe el tipo de productos que pertenecen a esta categoría..."
            />
          </div>

          {/* Error de envío */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Tags className="w-4 h-4 mr-2" />
                  {isEditing ? 'Actualizar Categoría' : 'Crear Categoría'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};