import React, { useState, useEffect } from 'react'; 
import LogoLumina from '../ui/LogoLumina';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  LayoutDashboard, Receipt, Settings, LogOut, ExternalLink, 
  Bell, Search, User, Terminal, Zap, Menu, X, Lock, Crown 
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [comercio, setComercio] = useState(null); // Estado para el plan y datos del usuario

  const [searchParams, setSearchParams] = useSearchParams();
  const terminoBusqueda = searchParams.get('buscar') || '';

  // 1. CARGAR DATOS DEL USUARIO (Para saber el plan en tiempo real)
  useEffect(() => {
    const cargarUsuario = async () => {
      const id = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token');
      if (!id || !token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setComercio(data);
        }
      } catch (error) {
        console.error("Error cargando perfil en el layout", error);
      }
    };
    cargarUsuario();
  }, [location.pathname]);

  const handleBuscar = (e) => {
    const texto = e.target.value;
    if (location.pathname !== '/dashboard') {
      navigate(`/dashboard?buscar=${texto}`);
    } else {
      texto ? setSearchParams({ buscar: texto }) : setSearchParams({});
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // 2. DEFINICIÓN DEL MENÚ CON LÓGICA DE BLOQUEO
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Transacciones', icon: <Receipt size={20} />, path: '/transacciones' },
    { name: 'Configuración', icon: <Settings size={20} />, path: '/configuracion' },
    { 
      name: 'Desarrolladores', 
      icon: <Terminal size={20} />, 
      path: '/desarrolladores',
      isLocked: comercio?.plan_actual !== 'business' // Bloqueado si no es Business
    },
    { name: 'Planes Pro', icon: <Zap size={20} />, path: '/planes', isSpecial: true }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <Toaster position="top-right" />
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 shadow-2xl z-40 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="absolute top-6 right-4 text-slate-400 hover:text-white md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} />
        </button>

        <div className="flex items-center justify-center h-20 border-b border-slate-800/50">
          <LogoLumina />
        </div>
        
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menú Principal</p>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button 
                  key={item.name}
                  onClick={() => {
                    if (item.isLocked) {
                      toast.error("Función exclusiva del Plan Business 🚀");
                      return;
                    }
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                    ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}
                    ${item.isSpecial ? 'border border-blue-500/30 mt-6 bg-blue-500/10' : ''}
                    ${item.isLocked ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={active ? 'text-white' : (item.isSpecial ? 'text-blue-400' : 'text-slate-400 group-hover:text-white')}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.isLocked && <Lock size={14} className="text-slate-500" />}
                </button>
              );
            })}
          </div>
          
          <div className="pt-6 mt-6 border-t border-slate-800/50">
            <button 
              onClick={() => {
                // 3. ARREGLO DEL BOTÓN DEMO: Nueva pestaña y ID de demo
                window.open('/checkout/demo_preview', '_blank');
                setIsSidebarOpen(false);
              }} 
              className="w-full flex items-center justify-between px-4 py-3 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20 group"
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={20} />
                <span className="font-medium">Ver Pasarela</span>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">VISTA</span>
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800/50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full w-full">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 mr-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden">
            <Menu size={24} />
          </button>

          <div className="hidden sm:flex items-center bg-slate-100 px-4 py-2 rounded-full w-48 md:w-64 border border-slate-200">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Buscar..." value={terminoBusqueda} onChange={handleBuscar} className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)} className="text-slate-400 hover:text-blue-600 p-1.5">
                <Bell size={22} />
              </button>
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            {/* PERFIL CON INSIGNIA DE PLAN */}
            <div className="relative">
              <div onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-all">
                <div className="text-right hidden md:block">
                  <div className="flex items-center justify-end gap-2">
                    <p className="text-sm font-bold text-slate-700 truncate max-w-[120px]">
                      {comercio?.nombre || 'Cargando...'}
                    </p>
                    {/* 4. INSIGNIA DE RANGO VISUAL */}
                    {comercio?.plan_actual === 'business' && (
                      <span className="bg-purple-100 text-purple-600 text-[9px] font-black px-1.5 py-0.5 rounded border border-purple-200 flex items-center gap-0.5 shadow-sm">
                        <Crown size={8} /> BIZ
                      </span>
                    )}
                    {comercio?.plan_actual === 'pro' && (
                      <span className="bg-amber-100 text-amber-600 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-200 shadow-sm">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Administrador</p>
                </div>
                <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md uppercase border-2 border-white ring-2 ring-slate-100">
                  {(comercio?.nombre || 'L').charAt(0)}
                </div>
              </div>

              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <p className="text-sm font-bold text-slate-800">{comercio?.nombre}</p>
                      <p className="text-xs text-slate-400 font-medium capitalize">Plan {comercio?.plan_actual}</p>
                    </div>
                    <button onClick={() => { setIsProfileMenuOpen(false); navigate('/perfil'); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                      <User size={16} /> Mi Perfil
                    </button>
                    <button onClick={() => { setIsProfileMenuOpen(false); navigate('/configuracion'); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                      <Settings size={16} /> Configuración
                    </button>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}