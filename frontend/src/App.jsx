import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ScrumBoard } from './components/ScrumBoard/ScrumBoard';
import { PedidoForm } from './components/PedidoForm/PedidoForm';

import { InventoryPanel } from './components/Inventory/InventoryPanel';
import { Navigation } from './components/Common/Navigation';

import { PedidosProvider } from './contexts/PedidosContext';
import { InventoryProvider } from './contexts/InventoryContext';

function App() {
  return (
    <PedidosProvider>
      <InventoryProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<ScrumBoard />} />
                <Route path="/nuevo-pedido" element={<PedidoForm />} />
                <Route path="/inventario" element={<InventoryPanel />} />
                <Route path="/pedidos" element={<ScrumBoard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </InventoryProvider>
    </PedidosProvider>
  );
}

export default App;

