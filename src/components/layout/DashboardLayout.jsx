import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-wider">
            Zahara<span className="text-blue-500">Pay</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="block px-4 py-2 bg-blue-600 text-white rounded-lg">Dashboard</a>
          <a href="#" className="block px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">Transacciones</a>
          <a href="#" className="block px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">Configuración</a>
          
          <button 
            onClick={() => navigate('/checkout')} /* Navega al Checkout */
            className="w-full text-left mt-4 block px-4 py-2 text-blue-400 hover:bg-gray-800 hover:text-blue-300 rounded-lg transition-colors border border-gray-800"
          >
            👁️ Ver Pasarela (Demo)
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => navigate('/login')} /* Botón para cerrar sesión */
            className="w-full px-4 py-2 text-sm text-red-400 border border-red-400 rounded-lg hover:bg-red-400 hover:text-white transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área Derecha (Contenido Principal) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navbar Superior */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-800">Panel de Control</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Comercio Activo</span>
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              Z
            </div>
          </div>
        </header>

        {/* Aquí es donde se inyectará el contenido de cada página */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
        
      </div>
    </div>
  );
}