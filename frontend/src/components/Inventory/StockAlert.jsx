import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const StockAlert = ({ count, products }) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">
              Alerta de Stock Bajo
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              {count} producto{count !== 1 ? 's' : ''} con stock inferior a 5 unidades
            </p>
            <ul className="text-sm text-yellow-600 mt-2 space-y-1">
              {products.slice(0, 3).map(product => (
                <li key={product.p_id}>
                  • {product.p_nombre} - {product.p_stock} unidades
                </li>
              ))}
              {products.length > 3 && (
                <li>... y {products.length - 3} más</li>
              )}
            </ul>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-600 hover:text-yellow-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};