import React, { useState, useEffect } from 'react'; 
import LogoLumina from '../ui/LogoLumina';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LayoutDashboard, Receipt, Settings, LogOut, ExternalLink, Bell, Search, User, Terminal, Zap, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ESTADOS DEL MENÚ
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  
  // ---> NUEVO: ESTADO PARA EL MENÚ LATERAL EN MÓVILES <---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ---> LÓGICA DE BÚSQUEDA <---
  const [searchParams, setSearchParams] = useSearchParams();
  const terminoBusqueda = searchParams.get('buscar') || '';

  const handleBuscar = (e) => {
    const texto = e.target.value;
    if (location.pathname !== '/dashboard') {
      navigate(`/dashboard?buscar=${texto}`);
    } else {
      if (texto) {
        setSearchParams({ buscar: texto });
      } else {
        setSearchParams({}); 
      }
    }
  };

  // ---> LÓGICA DE NOTIFICACIONES REALES <---
  useEffect(() => {
    const cargarNotificaciones = async () => {
      const comercioId = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token'); 

      if (comercioId && token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos/${comercioId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setNotificaciones(data.slice(0, 3)); 
          }
        } catch (error) { 
          console.error(error); 
        }
      }
    };
    cargarNotificaciones();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('comercioId');
    localStorage.removeItem('comercioNombre');
    localStorage.removeItem('token');
    
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Transacciones', icon: <Receipt size={20} />, path: '/transacciones' },
    { name: 'Configuración', icon: <Settings size={20} />, path: '/configuracion' },
    { name: 'Desarrolladores', icon: <Terminal size={20} />, path: '/desarrolladores' },
    { name: 'Planes Pro', icon: <Zap size={20} />, path: '/planes', isSpecial: true }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* ---> NUEVO: FONDO OSCURO PARA EL MENÚ EN MÓVIL <--- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR LATERAL (Moderna y Oscura) */}
      {/* ---> ACTUALIZADO: CLASES RESPONSIVAS Y TRANSCISIONES <--- */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 shadow-2xl z-40 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        
        {/* Botón de cerrar (solo móvil) */}
        <button 
          className="absolute top-6 right-4 text-slate-400 hover:text-white md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Logo de Lumina */}
        <div className="flex items-center justify-center h-20 border-b border-slate-800/50 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="15" width="24" height="70" rx="12" fill="#94A3B8" opacity="0.5"/>
              <rect x="20" y="61" width="65" height="24" rx="12" fill="#3B82F6" opacity="0.9"/>
              <rect x="20" y="61" width="24" height="24" rx="10" fill="#60A5FA" opacity="0.6"/>
            </svg>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Lumi<span className="text-blue-500">na</span>
            </span>
          </div>
        </div>
        
        {/* Navegación principal */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menú Principal</p>
          
          <div className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button 
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false); // Cierra el menú al elegir opción en móvil
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                    ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                    ${item.isSpecial ? 'border border-blue-500/30 mt-6 bg-blue-500/10 hover:bg-blue-500/20' : ''}
                  `}
                >
                  <div className={`${active ? 'text-white' : (item.isSpecial ? 'text-blue-400' : 'text-slate-400 group-hover:text-white')} transition-colors`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
          
          <div className="pt-6 mt-6 border-t border-slate-800/50">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Herramientas</p>
            <button 
              onClick={() => {
                navigate('/checkout');
                setIsSidebarOpen(false);
              }} 
              className="w-full flex items-center justify-between px-4 py-3 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-500/20 group"
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={20} />
                <span className="font-medium">Ver Pasarela</span>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md group-hover:bg-blue-500 group-hover:text-white transition-colors">DEMO</span>
            </button>
          </div>
        </nav>
        
        {/* Botón de Cerrar Sesión */}
        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DERECHA (Contenido Principal) */}
      {/* ---> ACTUALIZADO: ELIMINADA CLASE RELATIVE QUE PODRÍA CAUSAR DESBORDAMIENTOS EN MÓVIL <--- */}
      <div className="flex-1 flex flex-col h-full w-full">
        
        {/* HEADER SUPERIOR (Efecto Glassmorphism) */}
        {/* ---> ACTUALIZADO: AJUSTES DE ESPACIADO PARA MÓVILES (px-4 en lugar de px-8) <--- */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shrink-0">
          
          {/* ---> NUEVO: BOTÓN DE MENÚ HAMBURGUESA PARA MÓVILES <--- */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 mr-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
          >
            <Menu size={24} />
          </button>

          {/* Buscador visual (Oculto en pantallas muy pequeñas) */}
          <div className="hidden sm:flex items-center bg-slate-100 px-4 py-2 rounded-full w-48 md:w-64 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar pago o ref..." 
              value={terminoBusqueda}
              onChange={handleBuscar}
              className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Espaciador flexible para empujar iconos a la derecha en móviles si no hay buscador */}
          <div className="flex-1 sm:hidden"></div>

          <div className="flex items-center gap-4 md:gap-6">
            
            {/* CAMPANITA DE NOTIFICACIONES */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
                className="relative text-slate-400 hover:text-blue-600 transition-colors p-1.5"
              >
                <Bell size={22} />
                {notificaciones.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                  </span>
                )}
              </button>

              {/* Menú flotante de Notificaciones */}
              {isNotifMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifMenuOpen(false)}></div>
                  <div className="absolute right-0 md:right-auto mt-3 w-72 md:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center mb-1">
                      <p className="text-sm font-bold text-slate-800">Notificaciones</p>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notificaciones.length === 0 ? (
                        <p className="text-xs text-slate-500 p-4 text-center">No hay alertas nuevas.</p>
                      ) : (
                        notificaciones.map((notif, index) => (
                          <div key={index} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                            <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                              Nuevo pago de ${notif.monto}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 pl-4">
                              Ref: {notif.referencia || 'N/A'} • {new Date(notif.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <button 
                      onClick={() => { setIsNotifMenuOpen(false); navigate('/transacciones'); }}
                      className="w-full text-center px-4 py-2 mt-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 transition-colors"
                    >
                      Ver todas las transacciones
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div> {/* Divisor vertical (oculto en móvil) */}

            {/* PERFIL DE USUARIO CON MENÚ DESPLEGABLE */}
            <div className="relative">
              {/* Botón del perfil */}
              <div 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors select-none"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-700 leading-tight truncate max-w-[120px]">
                    {localStorage.getItem('comercioNombre') || 'Comercio'}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">Administrador</p>
                </div>
                <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30 uppercase border-2 border-white ring-2 ring-slate-100 transition-transform hover:scale-105 text-sm md:text-base">
                  {(localStorage.getItem('comercioNombre') || 'L').charAt(0)}
                </div>
              </div>

              {/* El menú flotante del perfil */}
              {isProfileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileMenuOpen(false)}
                  ></div>

                  <div className="absolute right-0 mt-3 w-48 md:w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 transform origin-top-right transition-all">
                    
                    <div className="px-4 py-3 border-b border-slate-50 mb-2 md:hidden">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {localStorage.getItem('comercioNombre') || 'Comercio'}
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Modo Administrador
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/perfil');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                    >
                      <User size={16} className="text-slate-400" />
                      Mi Perfil
                    </button>

                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/configuracion');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                    >
                      <Settings size={16} className="text-slate-400" />
                      Configuración
                    </button>

                    <div className="h-px bg-slate-100 my-2"></div>

                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* CONTENIDO INYECTADO (El Dashboard) */}
        {/* ---> ACTUALIZADO: ESPACIADO EN MÓVILES (p-4 en lugar de p-8) <--- */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-4 md:p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}