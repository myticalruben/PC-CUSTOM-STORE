import React from 'react';
import { User, Mail, FileText, Package, DollarSign } from 'lucide-react';

export const ResumenPedido = ({ formData, onSubmit, loading }) => {
  const total = formData.componentes.reduce(
    (sum, comp) => sum + (comp.producto.p_precio * comp.cantidad), 
    0
  );

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Resumen del Pedido
      </h2>

      <div className="space-y-6">
        {/* Información del Cliente */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Información del Cliente
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre:</span>
              <span className="font-medium">{formData.clienteNombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{formData.clienteEmail}</span>
            </div>
            {formData.descripcion && (
              <div>
                <span className="text-gray-600">Descripción:</span>
                <p className="font-medium mt-1">{formData.descripcion}</p>
              </div>
            )}
          </div>
        </section>

        {/* Componentes Seleccionados */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Componentes ({formData.componentes.length})
          </h3>
          <div className="space-y-3">
            {formData.componentes.map((componente, index) => (
              <div
                key={componente.producto.p_id}
                className="flex justify-between items-start p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {componente.producto.p_nombre}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {componente.producto.p_codigo} • {componente.producto.p_categoria_id?.c_nombre}
                      </p>
                      {componente.notas && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Notas:</strong> {componente.notas}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        ${(componente.producto.p_precio * componente.cantidad).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${componente.producto.p_precio} x {componente.cantidad}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resumen de Costos */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Resumen de Costos
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total Estimado:</span>
              <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-blue-600">
              * Este es un estimado. El precio final puede variar según disponibilidad.
            </p>
          </div>
        </section>

        {/* Confirmación */}
        <section className="border-t pt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">
              ¿Todo listo?
            </h4>
            <p className="text-green-700 text-sm">
              Al crear el pedido, este pasará al estado "Solicitud" y comenzará 
              el proceso de verificación de disponibilidad en el almacén.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};