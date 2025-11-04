import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePedidos } from '../../contexts/PedidosContext';
import { useInventory } from '../../contexts/InventoryContext';
import { ComponenteSelector } from './ComponenteSelector';
import { ResumenPedido } from './ResumenPedido';
import { ClienteForm } from './ClienteForm';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ArrowLeft, Save, ShoppingCart, User, Cpu } from 'lucide-react';

export const PedidoForm = () => {
  const navigate = useNavigate();
  const { createPedido, loading } = usePedidos();
  const { productos, categorias, loading: inventoryLoading } = useInventory();

  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    clienteNombre: '',
    clienteEmail: '',
    descripcion: '',
    componentes: []
  });

  const [errors, setErrors] = useState({});

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.clienteNombre.trim()) {
      newErrors.clienteNombre = 'El nombre del cliente es requerido';
    }

    if (!formData.clienteEmail.trim()) {
      newErrors.clienteEmail = 'El email del cliente es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.clienteEmail)) {
      newErrors.clienteEmail = 'El email no es válido';
    }

    if (formData.componentes.length === 0) {
      newErrors.componentes = 'Debe agregar al menos un componente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio de datos del cliente
  const handleClienteChange = (field, value) => {
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

  // Manejar componentes seleccionados
  const handleComponentesChange = (nuevosComponentes) => {
    setFormData(prev => ({
      ...prev,
      componentes: nuevosComponentes
    }));

    if (errors.componentes) {
      setErrors(prev => ({
        ...prev,
        componentes: null
      }));
    }
  };

  // Siguiente paso
  const handleNext = () => {
    if (activeStep === 1 && validateClienteStep()) {
      setActiveStep(2);
    } else if (activeStep === 2 && validateComponentesStep()) {
      setActiveStep(3);
    }
  };

  // Paso anterior
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Validar paso del cliente
  const validateClienteStep = () => {
    const newErrors = {};
    
    if (!formData.clienteNombre.trim()) {
      newErrors.clienteNombre = 'El nombre del cliente es requerido';
    }

    if (!formData.clienteEmail.trim()) {
      newErrors.clienteEmail = 'El email del cliente es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.clienteEmail)) {
      newErrors.clienteEmail = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar paso de componentes
  const validateComponentesStep = () => {
    const newErrors = {};
    
    if (formData.componentes.length === 0) {
      newErrors.componentes = 'Debe agregar al menos un componente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const pedidoData = {
        clienteNombre: formData.clienteNombre,
        clienteEmail: formData.clienteEmail,
        descripcion: formData.descripcion || `PC personalizada para ${formData.clienteNombre}`,
        componentes: formData.componentes.map(comp => ({
          producto: { p_id: comp.producto.p_id },
          cantidad: comp.cantidad,
          notas: comp.notas || ''
        }))
      };

      await createPedido(pedidoData);
      navigate('/pedidos');
    } catch (error) {
      console.error('Error al crear pedido:', error);
    }
  };

  if (inventoryLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/pedidos')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a Pedidos
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nuevo Pedido</h1>
            <p className="text-gray-600 mt-1">
              Crea una nueva solicitud de PC personalizada
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { number: 1, label: 'Cliente', icon: User },
            { number: 2, label: 'Componentes', icon: Cpu },
            { number: 3, label: 'Resumen', icon: ShoppingCart }
          ].map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === step.number;
            const isCompleted = activeStep > step.number;
            const isLast = index === 2;

            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Save className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      isActive || isCompleted
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      activeStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {activeStep === 1 && (
            <ClienteForm
              formData={formData}
              errors={errors}
              onChange={handleClienteChange}
            />
          )}

          {activeStep === 2 && (
            <ComponenteSelector
              componentes={formData.componentes}
              onChange={handleComponentesChange}
              error={errors.componentes}
            />
          )}

          {activeStep === 3 && (
            <ResumenPedido
              formData={formData}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>

        {/* Sidebar - Preview */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen del Pedido
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Cliente:</span>
                <p className="font-medium text-gray-900">
                  {formData.clienteNombre || 'No especificado'}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.clienteEmail || 'No especificado'}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Componentes:</span>
                <p className="font-medium text-gray-900">
                  {formData.componentes.length} componentes
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Total estimado:</span>
                <p className="font-medium text-xl text-blue-600">
                  ${formData.componentes
                    .reduce((total, comp) => total + (comp.producto.p_precio * comp.cantidad), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 space-y-3">
              {activeStep > 1 && (
                <button
                  onClick={handleBack}
                  className="w-full btn-secondary"
                >
                  Anterior
                </button>
              )}

              {activeStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="w-full btn-primary"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Crear Pedido
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};