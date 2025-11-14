import React, { useState } from 'react';
import { StatusBadge } from '../Common/StatusBadge';
import { MoreVertical, User, Mail, Calendar, Cpu, CheckCircle, FileText, ArrowRight } from 'lucide-react';

export const PedidoCard = ({ 
  pedido, 
  onClick, 
  onMoverPedido, 
  onVerificarDisponibilidad,
  onGenerarFactura,
  isVerifying,
  isMoving,
  currentEstado 
}) => {
  const [showActions, setShowActions] = useState(false);

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

  // Obtener acciones disponibles según el estado actual
  const getAccionesDisponibles = () => {
    const acciones = [];
    
    switch (currentEstado) {
      case 'SOLICITUD':
        acciones.push({
          label: 'Mover a Análisis',
          action: () => onMoverPedido(pedido.id, 'ANALISIS'),
          icon: ArrowRight,
          color: 'text-yellow-600'
        });
        break;
        
      case 'ANALISIS':
        acciones.push(
          {
            label: isVerifying ? 'Verificando...' : 'Verificar Stock',
            action: () => onVerificarDisponibilidad(pedido.id),
            icon: CheckCircle,
            color: 'text-blue-600',
            disabled: isVerifying
          },
          {
            label: 'Saltar a Ensamblado',
            action: () => onMoverPedido(pedido.id, 'ENSAMBLADO'),
            icon: ArrowRight,
            color: 'text-green-600'
          }
        );
        break;
        
      case 'ENSAMBLADO':
        acciones.push({
          label: 'Mover a Facturación',
          action: () => onMoverPedido(pedido.id, 'FACTURACION'),
          icon: ArrowRight,
          color: 'text-purple-600'
        });
        break;
        
      case 'FACTURACION':
        acciones.push({
          label: 'Generar Factura',
          action: () => onGenerarFactura(pedido.id),
          icon: FileText,
          color: 'text-green-600'
        });
        break;
        
      default:
        break;
    }
    
    return acciones;
  };

  const acciones = getAccionesDisponibles();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 
              className="font-semibold text-gray-900 text-sm truncate cursor-pointer hover:text-blue-600"
              onClick={onClick}
              title={pedido.clienteNombre}
            >
              {pedido.clienteNombre}
            </h4>
            
            {/* Botón de acciones */}
            {acciones.length > 0 && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
                      {acciones.map((accion, index) => {
                        const Icon = accion.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              accion.action();
                              setShowActions(false);
                            }}
                            disabled={accion.disabled || isMoving}
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Icon className={`w-4 h-4 mr-2 ${accion.color}`} />
                            {accion.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <StatusBadge status={pedido.estado} />
        </div>
      </div>

      {/* Información compacta */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
          <span className="truncate" title={pedido.clienteEmail}>
            {pedido.clienteEmail}
          </span>
        </div>
        
        {pedido.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {pedido.descripcion}
          </p>
        )}
      </div>

      {/* Resumen rápido */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center">
          <Cpu className="w-3 h-3 mr-1" />
          <span>{getComponentesCount()} comp.</span>
        </div>
        <div className="font-semibold text-blue-600">
          ${calcularTotal().toFixed(2)}
        </div>
      </div>

      {/* Fechas y acciones rápidas */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-2">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          <span>
            {new Date(pedido.fechaCreacion).toLocaleDateString()}
          </span>
        </div>
        
        {/* Acciones rápidas visibles */}
        {acciones.length > 0 && (
          <div className="flex space-x-1">
            {acciones.slice(0, 1).map((accion, index) => {
              const Icon = accion.icon;
              return (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    accion.action();
                  }}
                  disabled={accion.disabled || isMoving}
                  className={`p-1 rounded text-xs ${accion.color} hover:bg-gray-100 disabled:opacity-50`}
                  title={accion.label}
                >
                  <Icon className="w-3 h-3" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Botón de ver detalles (siempre visible en móvil) */}
      <button
        onClick={onClick}
        className="w-full mt-3 py-2 text-xs text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors md:hidden"
      >
        Ver Detalles
      </button>
    </div>
  );
};