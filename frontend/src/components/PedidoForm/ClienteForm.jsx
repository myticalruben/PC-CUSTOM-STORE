import React from 'react';
import { User, Mail, FileText } from 'lucide-react';

export const ClienteForm = ({ formData, errors, onChange }) => {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Información del Cliente
      </h2>

      <div className="space-y-6">
        {/* Nombre del Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Nombre del Cliente *
            </div>
          </label>
          <input
            type="text"
            value={formData.clienteNombre}
            onChange={(e) => onChange('clienteNombre', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.clienteNombre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingrese el nombre completo del cliente"
          />
          {errors.clienteNombre && (
            <p className="mt-1 text-sm text-red-600">{errors.clienteNombre}</p>
          )}
        </div>

        {/* Email del Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email del Cliente *
            </div>
          </label>
          <input
            type="email"
            value={formData.clienteEmail}
            onChange={(e) => onChange('clienteEmail', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.clienteEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="cliente@ejemplo.com"
          />
          {errors.clienteEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.clienteEmail}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Descripción del Pedido
            </div>
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => onChange('descripcion', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe los requisitos específicos de la PC personalizada..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Opcional: Especificaciones técnicas, uso previsto, etc.
          </p>
        </div>
      </div>
    </div>
  );
};