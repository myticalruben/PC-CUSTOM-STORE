import React from 'react';
import { PedidoCard } from './PedidoCard';
import { MoreVertical, Users } from 'lucide-react';

export const Column = ({ 
  title, 
  estado, 
  color, 
  textColor, 
  pedidos, 
  onPedidoClick, 
  onMoverPedido,
  onVerificarDisponibilidad,
  onGenerarFactura,
  isVerifying,
  isMoving,
  estados 
}) => {
  
  // Obtener estados disponibles para mover
  const getEstadosDisponibles = (currentEstado) => {
    const estadoIndex = estados.findIndex(e => e.key === currentEstado);
    const disponibles = [];
    
    // Puede moverse al estado anterior y siguiente
    if (estadoIndex > 0) {
      disponibles.push(estados[estadoIndex - 1]);
    }
    if (estadoIndex < estados.length - 1) {
      disponibles.push(estados[estadoIndex + 1]);
    }
    
    return disponibles;
  };
/*
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const pedidoId = e.dataTransfer.getData('pedidoId');
    const fromEstado = e.dataTransfer.getData('fromEstado');
    
    if (fromEstado !== estado && !isMoving) {
      onMoverPedido(parseInt(pedidoId), estado);
    }
  };
*/
  return (
    <div 
      className={`w-80 flex-shrink-0 rounded-lg ${color} p-4`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className={`font-semibold ${textColor}`}>{title}</h3>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${textColor} bg-white bg-opacity-50`}>
            {pedidos.length}
          </span>
        </div>
        <button className={`p-1 rounded ${textColor} hover:bg-white hover:bg-opacity-20`}>
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Pedidos List */}
      <div className="space-y-3">
        {pedidos.map(pedido => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            onClick={() => onPedidoClick(pedido)}
            onMoverPedido={onMoverPedido}
            onVerificarDisponibilidad={onVerificarDisponibilidad}
            onGenerarFactura={onGenerarFactura}
            isVerifying={isVerifying}
            isMoving={isMoving}
            estadosDisponibles={getEstadosDisponibles(estado)}
            currentEstado={estado}
          />
        ))}
      </div>

      {/* Empty State */}
      {pedidos.length === 0 && (
        <div className={`text-center py-8 rounded-lg border-2 border-dashed ${textColor} border-opacity-30`}>
          <Users className={`w-8 h-8 mx-auto mb-2 ${textColor} opacity-40`} />
          <p className={`text-sm ${textColor} opacity-60`}>No hay pedidos</p>
        </div>
      )}
    </div>
  );
};