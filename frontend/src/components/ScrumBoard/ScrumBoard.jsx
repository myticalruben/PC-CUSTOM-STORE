import React, { useState, useMemo } from 'react';
import { usePedidos } from '../../contexts/PedidosContext';
//import { useInventory } from '../../contexts/InventoryContext';
import { PedidoCard } from './PedidoCard';
import { PedidoDetails } from './PedidoDetails';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { Plus, Filter, Search, RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export const ScrumBoard = () => {
  const { 
    pedidos, 
    loading, 
    error, 
    fetchPedidos,
    updatePedidoEstado,
    verificarDisponibilidad,
    generarFactura 
  } = usePedidos();
  
  //const { productos } = useInventory();
  
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [expandedEstados, setExpandedEstados] = useState({
    SOLICITUD: true,
    ANALISIS: true,
    ENSAMBLADO: true,
    FACTURACION: true,
    COMPLETADO: true
  });

  // Estados del tablero
  const estados = [
    { 
      key: 'SOLICITUD', 
      title: 'Solicitud', 
      color: 'bg-gray-100', 
      textColor: 'text-gray-700',
      icon: '📋',
      description: 'Nuevas solicitudes de PCs personalizadas'
    },
    { 
      key: 'ANALISIS', 
      title: 'Análisis', 
      color: 'bg-yellow-100', 
      textColor: 'text-yellow-700',
      icon: '🔍',
      description: 'Verificando disponibilidad de componentes'
    },
    { 
      key: 'ENSAMBLADO', 
      title: 'Ensamblado', 
      color: 'bg-blue-100', 
      textColor: 'text-blue-700',
      icon: '⚙️',
      description: 'En proceso de ensamblaje'
    },
    { 
      key: 'FACTURACION', 
      title: 'Facturación', 
      color: 'bg-purple-100', 
      textColor: 'text-purple-700',
      icon: '🧾',
      description: 'Listo para facturar'
    },
    { 
      key: 'COMPLETADO', 
      title: 'Completado', 
      color: 'bg-green-100', 
      textColor: 'text-green-700',
      icon: '✅',
      description: 'Pedidos finalizados'
    }
  ];

  // Filtrar pedidos
  const pedidosFiltrados = useMemo(() => {
    let filtered = pedidos;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pedido =>
        pedido.clienteNombre?.toLowerCase().includes(term) ||
        pedido.clienteEmail?.toLowerCase().includes(term) ||
        pedido.descripcion?.toLowerCase().includes(term)
      );
    }

    // Filtrar por estado
    if (filterEstado !== 'all') {
      filtered = filtered.filter(pedido => pedido.estado === filterEstado);
    }

    return filtered;
  }, [pedidos, searchTerm, filterEstado]);

  // Agrupar pedidos por estado
  const pedidosPorEstado = useMemo(() => {
    const grouped = {};
    estados.forEach(estado => {
      grouped[estado.key] = pedidosFiltrados.filter(pedido => pedido.estado === estado.key);
    });
    return grouped;
  }, [pedidosFiltrados, estados]);

  // Mover pedido entre columnas
  const moverPedido = async (pedidoId, nuevoEstado) => {
    if (isMoving) return;
    
    setIsMoving(true);
    try {
      console.log(`Moviendo pedido ${pedidoId} a estado: ${nuevoEstado}`);
      await updatePedidoEstado(pedidoId, nuevoEstado);
    } catch (error) {
      console.error('Error al mover pedido:', error);
      alert('Error al actualizar el estado del pedido');
    } finally {
      setIsMoving(false);
    }
  };

  // Verificar disponibilidad para análisis
  const handleVerificarDisponibilidad = async (pedidoId) => {
    if (isVerifying) return;
    
    setIsVerifying(true);
    try {
      const disponible = await verificarDisponibilidad(pedidoId);
      
      if (disponible) {
        // Si hay disponibilidad, mover a ENSAMBLADO
        await updatePedidoEstado(pedidoId, 'ENSAMBLADO');
        alert('¡Stock disponible! El pedido ha sido movido a Ensamblado.');
      } else {
        // Si no hay disponibilidad, mantener en ANÁLISIS pero mostrar alerta
        alert('No hay stock suficiente para algunos componentes. El pedido permanecerá en análisis.');
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      alert('Error al verificar la disponibilidad. Intenta nuevamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Generar factura
  const handleGenerarFactura = async (pedidoId) => {
    try {
      const factura = await generarFactura(pedidoId);
      if (factura) {
        alert(`Factura ${factura.numeroFactura} generada exitosamente. Total: $${factura.total}`);
      }
    } catch (error) {
      console.error('Error al generar factura:', error);
      alert('Error al generar la factura. Intenta nuevamente.');
    }
  };

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = pedidos.length;
    const porEstado = {};
    
    estados.forEach(estado => {
      porEstado[estado.key] = pedidos.filter(p => p.estado === estado.key).length;
    });

    return { total, porEstado };
  }, [pedidos]);

  // Toggle expandir/colapsar sección
  const toggleEstado = (estadoKey) => {
    setExpandedEstados(prev => ({
      ...prev,
      [estadoKey]: !prev[estadoKey]
    }));
  };

  // Expandir/colapsar todos
  const toggleAllEstados = (expand) => {
    const newState = {};
    estados.forEach(estado => {
      newState[estado.key] = expand;
    });
    setExpandedEstados(newState);
  };

  if (loading && pedidos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && pedidos.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center text-red-800">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
        <button
          onClick={fetchPedidos}
          className="mt-3 btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tablero de Pedidos</h1>
          <p className="text-gray-600 mt-2">
            Vista vertical - Gestión de pedidos de PCs personalizadas
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => toggleAllEstados(true)}
            className="btn-secondary text-sm"
          >
            Expandir Todo
          </button>
          <button
            onClick={() => toggleAllEstados(false)}
            className="btn-secondary text-sm"
          >
            Colapsar Todo
          </button>
          <button
            onClick={fetchPedidos}
            disabled={loading}
            className="flex items-center btn-secondary disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Pedidos</div>
        </div>
        {estados.map(estado => (
          <div key={estado.key} className={`rounded-lg p-4 ${estado.color} cursor-pointer hover:shadow-md transition-shadow`}>
            <div className={`text-2xl font-bold ${estado.textColor}`}>
              {stats.porEstado[estado.key] || 0}
            </div>
            <div className={`text-sm ${estado.textColor}`}>
              {estado.title}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar pedidos por cliente, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro por estado */}
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los estados</option>
            {estados.map(estado => (
              <option key={estado.key} value={estado.key}>
                {estado.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tablero Vertical */}
      <div className="space-y-4">
        {estados.map(estado => {
          const pedidosEnEstado = pedidosPorEstado[estado.key] || [];
          const isExpanded = expandedEstados[estado.key];
          
          return (
            <div key={estado.key} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header de la sección */}
              <div 
                className={`p-4 ${estado.color} cursor-pointer hover:opacity-90 transition-opacity`}
                onClick={() => toggleEstado(estado.key)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{estado.icon}</span>
                    <div>
                      <h3 className={`font-semibold text-lg ${estado.textColor}`}>
                        {estado.title}
                      </h3>
                      <p className={`text-sm ${estado.textColor} opacity-80`}>
                        {estado.description} • {pedidosEnEstado.length} pedidos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${estado.textColor} bg-white bg-opacity-50`}>
                      {pedidosEnEstado.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className={`w-5 h-5 ${estado.textColor}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${estado.textColor}`} />
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido de la sección */}
              {isExpanded && (
                <div className="p-4">
                  {pedidosEnEstado.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {pedidosEnEstado.map(pedido => (
                        <PedidoCard
                          key={pedido.id}
                          pedido={pedido}
                          onClick={() => setSelectedPedido(pedido)}
                          onMoverPedido={moverPedido}
                          onVerificarDisponibilidad={handleVerificarDisponibilidad}
                          onGenerarFactura={handleGenerarFactura}
                          isVerifying={isVerifying}
                          isMoving={isMoving}
                          currentEstado={estado.key}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">{estado.icon}</span>
                      </div>
                      <p>No hay pedidos en {estado.title.toLowerCase()}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {estado.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Detalles del Pedido */}
      {selectedPedido && (
        <PedidoDetails
          pedido={selectedPedido}
          onClose={() => setSelectedPedido(null)}
          onEstadoChange={moverPedido}
          onVerificarDisponibilidad={handleVerificarDisponibilidad}
          onGenerarFactura={handleGenerarFactura}
          isVerifying={isVerifying}
          isMoving={isMoving}
        />
      )}

      {/* Empty State General */}
      {pedidos.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay pedidos
          </h3>
          <p className="text-gray-500 mb-6">
            Comienza creando tu primer pedido de PC personalizada
          </p>
          <button
            onClick={() => window.location.href = '/nuevo-pedido'}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Pedido
          </button>
        </div>
      )}

      {/* Loading overlay para operaciones */}
      {(isVerifying || isMoving) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <LoadingSpinner size="md" />
            <span className="text-gray-700">
              {isVerifying ? 'Verificando disponibilidad...' : 'Actualizando estado...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};