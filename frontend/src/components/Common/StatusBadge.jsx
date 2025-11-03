const statusConfig = {
  SOLICITUD: { color: 'bg-gray-100 text-gray-800', label: 'Solicitud' },
  ANALISIS: { color: 'bg-yellow-100 text-yellow-800', label: 'Análisis' },
  ENSAMBLADO: { color: 'bg-blue-100 text-blue-800', label: 'Ensamblado' },
  FACTURACION: { color: 'bg-purple-100 text-purple-800', label: 'Facturación' },
  COMPLETADO: { color: 'bg-green-100 text-green-800', label: 'Completado' }
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.SOLICITUD;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};