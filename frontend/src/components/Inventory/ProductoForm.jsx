import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { X, Package, DollarSign, Hash, Calendar, Tag } from 'lucide-react';

export const ProductoForm = ({ producto, onClose, categorias }) => {
  const { createProducto, updateProducto} = useInventory();
  
  const [formData, setFormData] = useState({
    p_nombre: '',
    p_codigo: '',
    p_precio: '',
    p_stock: '',
    p_fecha_creacion: new Date().toISOString().split('T')[0],
    p_categoria_id: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!producto;

  // Cargar datos si está editando
  useEffect(() => {
    if (producto) {
      setFormData({
        p_nombre: producto.p_nombre || '',
        p_codigo: producto.p_codigo || '',
        p_precio: producto.p_precio?.toString() || '',
        p_stock: producto.p_stock?.toString() || '',
        p_fecha_creacion: producto.p_fecha_creacion 
          ? new Date(producto.p_fecha_creacion).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        p_categoria_id: producto.p_categoria_id?.c_id?.toString() || ''
      });
    }
  }, [producto]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.p_nombre.trim()) {
      newErrors.p_nombre = 'El nombre del producto es requerido';
    }

    if (!formData.p_codigo.trim()) {
      newErrors.p_codigo = 'El código del producto es requerido';
    }

    if (!formData.p_precio || parseFloat(formData.p_precio) <= 0) {
      newErrors.p_precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.p_stock || parseInt(formData.p_stock) < 0) {
      newErrors.p_stock = 'El stock no puede ser negativo';
    }

    if (!formData.p_categoria_id) {
      newErrors.p_categoria_id = 'Debe seleccionar una categoría';
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
      const productoData = {
        ...formData,
        p_precio: parseFloat(formData.p_precio),
        p_stock: parseInt(formData.p_stock),
        p_categoria_id: {
          c_id: parseInt(formData.p_categoria_id)
        }
      };

      if (isEditing) {
        await updateProducto(producto.p_id, productoData);
      } else {
        await createProducto(productoData);
      }

      onClose();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setErrors({ submit: 'Error al guardar el producto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
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
          {/* Nombre y Código */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Nombre del Producto *
                </div>
              </label>
              <input
                type="text"
                value={formData.p_nombre}
                onChange={(e) => handleChange('p_nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.p_nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Intel Core i9-13900K"
              />
              {errors.p_nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.p_nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  Código del Producto *
                </div>
              </label>
              <input
                type="text"
                value={formData.p_codigo}
                onChange={(e) => handleChange('p_codigo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.p_codigo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: INTEL-I9-13900K"
              />
              {errors.p_codigo && (
                <p className="mt-1 text-sm text-red-600">{errors.p_codigo}</p>
              )}
            </div>
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Precio *
                </div>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.p_precio}
                onChange={(e) => handleChange('p_precio', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.p_precio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.p_precio && (
                <p className="mt-1 text-sm text-red-600">{errors.p_precio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  Stock *
                </div>
              </label>
              <input
                type="number"
                min="0"
                value={formData.p_stock}
                onChange={(e) => handleChange('p_stock', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.p_stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.p_stock && (
                <p className="mt-1 text-sm text-red-600">{errors.p_stock}</p>
              )}
            </div>
          </div>

          {/* Categoría y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Categoría *
                </div>
              </label>
              <select
                value={formData.p_categoria_id}
                onChange={(e) => handleChange('p_categoria_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.p_categoria_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.c_id} value={categoria.c_id}>
                    {categoria.c_nombre}
                  </option>
                ))}
              </select>
              {errors.p_categoria_id && (
                <p className="mt-1 text-sm text-red-600">{errors.p_categoria_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Fecha de Creación
                </div>
              </label>
              <input
                type="date"
                value={formData.p_fecha_creacion}
                onChange={(e) => handleChange('p_fecha_creacion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
                  <Package className="w-4 h-4 mr-2" />
                  {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};