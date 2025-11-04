import React from 'react';
import { 
  X, User, Mail, FileText, Calendar, Cpu, DollarSign, 
  CheckCircle, Package, Clock, AlertCircle 
} from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';

export const PedidoDetails = ({ 
  pedido, 
  onClose, 
  onEstadoChange,
  onVerificarDisponibilidad,
  onGenerarFactura,
  isVerifying 
}) => {
  
  const calcularTotal = () => {
    if (!pedido.componentes) return 0;
    return pedido.componentes.reduce((total, comp) => {
      return total + (comp.producto.p_precio * comp.cantidad);
    }, 0);
  };

  const getAccionesDisponibles = () => {
    const acciones = [];
    
    switch (pedido.estado) {
      case 'SOLICITUD':
        acciones.push({
          label: 'Mover a Análisis',
          action: () => onEstadoChange(pedido.id, 'ANALISIS'),
          color: 'bg-yellow-500 hover:bg-yellow-600'
        });
        break;
        
      case 'ANALISIS':
        acciones.push({
          label: isVerifying ? 'Verificando...' : 'Verificar Disponibilidad',
          action: () => onVerificarDisponibilidad(pedido.id),
          color: 'bg-blue-500 hover:bg-blue-600',
          disabled: isVerifying
        });
        break;
        
      case 'ENSAMBLADO':
        acciones.push({
          label: 'Mover a Facturación',
          action: () => onEstadoChange(pedido.id, 'FACTURACION'),
          color: 'bg-purple-500 hover:bg-purple-600'
        });
        break;
        
      case 'FACTURACION':
        acciones.push({
          label: 'Generar Factura',
          action: () => onGenerarFactura(pedido.id),
          color: 'bg-green-500 hover:bg-green-600'
        });
        break;
        
      default:
        break;
    }
    
    return acciones;
  };

  if (!pedido) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Pedido #{pedido.id}
            </h2>
            <div className="flex items-center mt-2 space-x-4">
              <StatusBadge status={pedido.estado} />
              <span className="text-sm text-gray-500">
                Creado: {new Date(pedido.fechaCreacion).toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información del Cliente */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Información del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{pedido.clienteNombre}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{pedido.clienteEmail}</p>
                </div>
              </div>
            </div>
            
            {pedido.descripcion && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Descripción</p>
                    <p className="text-blue-700">{pedido.descripcion}</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Componentes del Pedido */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Cpu className="w-5 h-5 mr-2" />
              Componentes ({pedido.componentes?.length || 0})
            </h3>
            
            {pedido.componentes && pedido.componentes.length > 0 ? (
              <div className="space-y-3">
                {pedido.componentes.map((componente, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
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
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        ${(componente.producto.p_precio * componente.cantidad).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${componente.producto.p_precio} x {componente.cantidad}
                      </p>
                      <p className={`text-xs ${
                        componente.producto.p_stock < componente.cantidad 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        Stock: {componente.producto.p_stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No hay componentes en este pedido</p>
              </div>
            )}
          </section>

          {/* Resumen y Acciones */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resumen de Costos */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Resumen de Costos
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${calcularTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total Estimado:</span>
                    <span className="text-blue-600">${calcularTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Acciones</h4>
                {getAccionesDisponibles().map((accion, index) => (
                  <button
                    key={index}
                    onClick={accion.action}
                    disabled={accion.disabled}
                    className={`w-full py-3 px-4 text-white font-medium rounded-lg transition-colors duration-200 ${
                      accion.disabled ? 'opacity-50 cursor-not-allowed' : ''
                    } ${accion.color}`}
                  >
                    {accion.label}
                  </button>
                ))}
                
                {getAccionesDisponibles().length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No hay acciones disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};