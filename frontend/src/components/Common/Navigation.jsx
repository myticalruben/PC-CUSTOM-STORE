import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Settings, 
  Menu, 
  X,
  User,
  Bell,
  Search
} from 'lucide-react';

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Tablero',
      href: '/',
      icon: LayoutDashboard,
      description: 'Vista general de pedidos'
    },
    {
      name: 'Pedidos',
      href: '/pedidos',
      icon: FileText,
      description: 'Gestión de pedidos'
    },
    {
      name: 'Nuevo Pedido',
      href: '/nuevo-pedido',
      icon: FileText,
      description: 'Crear nuevo pedido'
    },
    {
      name: 'Inventario',
      href: '/inventario',
      icon: Package,
      description: 'Gestión de productos'
    },
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo y Navegación Principal */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CpuIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">PC Custom</span>
              </Link>

              {/* Navigation Items - Desktop */}
              <div className="hidden md:flex space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      title={item.description}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Search Bar y User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar pedidos, productos..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      to="/configuracion"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Configuración
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}

              {/* Mobile User Section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Admin</div>
                    <div className="text-sm text-gray-500">Administrador</div>
                  </div>
                </div>
                
                <div className="mt-2 space-y-1">
                  <Link
                    to="/perfil"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    to="/configuracion"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                  >
                    Configuración
                  </Link>
                  <button className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg">
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

// Custom CPU Icon Component
const CpuIcon = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
    <rect x="9" y="9" width="6" height="6" strokeWidth="2"/>
    <line x1="9" y1="4" x2="9" y2="2" strokeWidth="2"/>
    <line x1="15" y1="4" x2="15" y2="2" strokeWidth="2"/>
    <line x1="9" y1="22" x2="9" y2="20" strokeWidth="2"/>
    <line x1="15" y1="22" x2="15" y2="20" strokeWidth="2"/>
    <line x1="20" y1="9" x2="22" y2="9" strokeWidth="2"/>
    <line x1="20" y1="15" x2="22" y2="15" strokeWidth="2"/>
    <line x1="2" y1="9" x2="4" y2="9" strokeWidth="2"/>
    <line x1="2" y1="15" x2="4" y2="15" strokeWidth="2"/>
  </svg>
);