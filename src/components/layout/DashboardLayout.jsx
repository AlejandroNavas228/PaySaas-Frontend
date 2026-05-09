import React, { useState, useEffect } from 'react'; 
import LogoLumina from '../ui/LogoLumina';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, Receipt, Settings, LogOut, ExternalLink, 
  Bell, User, Terminal, Zap, Menu, X, Lock, Crown, ShieldCheck 
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [comercio, setComercio] = useState(null);

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
      } catch (error) { console.error(error); }
    };
    cargarUsuario();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  // 💡 LÓGICA DE MENÚ CORREGIDA
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Transacciones', icon: <Receipt size={20} />, path: '/transacciones' },
    { name: 'Configuración', icon: <Settings size={20} />, path: '/configuracion' },
    { 
      name: 'Desarrolladores', 
      icon: <Terminal size={20} />, 
      path: '/desarrolladores',
      isLocked: comercio?.plan_actual !== 'business'
    }
  ];

  // 👑 SI ERES ADMIN, AGREGAMOS EL BOTÓN AL FINAL
  // Importante: Asegúrate de que este correo coincida con tu .env
  const correoAdmin = "alejandronavas228@gmail.com".toLowerCase(); 
  
  if (comercio?.email?.toLowerCase() === correoAdmin) {
    menuItems.push({ 
      name: 'Panel Admin', 
      icon: <ShieldCheck size={20} />, 
      path: '/admin',
      isSpecial: true 
    });
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR RE-DISEÑADO */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
            <LogoLumina />
            <button className="md:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.isLocked) return toast.error("Plan Business requerido");
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group
                  ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                  ${item.isSpecial ? 'mt-4 border border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
                {item.isLocked && <Lock size={14} className="opacity-40" />}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-white/5">
              <button onClick={() => navigate('/planes')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-amber-400 hover:bg-amber-400/10 rounded-xl transition-all">
                <Zap size={20} /> Mejorar Plan
              </button>
            </div>
          </nav>

          <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500"><Menu size={24} /></button>
          
          <div className="flex-1"></div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative">
              <div onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-all">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {comercio?.nombre?.charAt(0).toUpperCase()}
                </div>
              </div>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{comercio?.nombre}</p>
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider">{comercio?.plan_actual}</p>
                  </div>
                  <button onClick={() => {navigate('/perfil'); setIsProfileMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-all"><User size={16} /> Perfil</button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all"><LogOut size={16} /> Salir</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}