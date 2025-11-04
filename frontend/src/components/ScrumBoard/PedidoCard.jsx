import React, { useState } from 'react';
import { StatusBadge } from '../Common/StatusBadge';
import { MoreVertical, User, Mail, Calendar, Cpu, CheckCircle, FileText } from 'lucide-react';

export const PedidoCard = ({ 
  pedido, 
  onClick, 
  onMoverPedido, 
  onVerificarDisponibilidad,
  onGenerarFactura,
  isVerifying,
  estadosDisponibles,
  currentEstado 
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('pedidoId', pedido.id);
    e.dataTransfer.setData('fromEstado', currentEstado);
  };

  const calcularTotal = () => {
    if (!pedido.componentes) return 0;
    return pedido.componentes.reduce((total, comp) => {
      return total + (comp.producto.p_precio * comp.cantidad);
    }, 0);
  };

  const getComponentesCount = () => {
    if (!pedido.componentes) return 0;
    return pedido.componentes.reduce((count, comp) => count + comp.cantidad, 0);
  };

  const handleAction = (action) => {
    setShowActions(false);
    
    switch (action) {
      case 'verificar':
        onVerificarDisponibilidad(pedido.id);
        break;
      case 'facturar':
        onGenerarFactura(pedido.id);
        break;
      default:
        break;
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
              {pedido.clienteNombre}
            </h4>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Actions */}
              {showActions && (
                <div 
                  className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    {/* Acciones específicas por estado */}
                    {currentEstado === 'ANALISIS' && (
                      <button
                        onClick={() => handleAction('verificar')}
                        disabled={isVerifying}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isVerifying ? 'Verificando...' : 'Verificar Stock'}
                      </button>
                    )}

                    {currentEstado === 'FACTURACION' && (
                      <button
                        onClick={() => handleAction('facturar')}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Generar Factura
                      </button>
                    )}

                    {/* Movimiento entre estados */}
                    {estadosDisponibles.map(estado => (
                      <button
                        key={estado.key}
                        onClick={() => onMoverPedido(pedido.id, estado.key)}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Mover a {estado.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <StatusBadge status={pedido.estado} />
        </div>
      </div>

      {/* Client Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-3 h-3 mr-2" />
          <span className="truncate">{pedido.clienteEmail}</span>
        </div>
        
        {pedido.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {pedido.descripcion}
          </p>
        )}
      </div>

      {/* Components Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center">
          <Cpu className="w-3 h-3 mr-1" />
          <span>{getComponentesCount()} componentes</span>
        </div>
        <div className="font-semibold text-blue-600">
          ${calcularTotal().toFixed(2)}
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-2">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          <span>
            {new Date(pedido.fechaCreacion).toLocaleDateString()}
          </span>
        </div>
        
        {pedido.fechaActualizacion && (
          <span>
            Actualizado: {new Date(pedido.fechaActualizacion).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};