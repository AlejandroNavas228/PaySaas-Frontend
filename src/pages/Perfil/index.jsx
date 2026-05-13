import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Shield, Save, Loader2, eye, eyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function Perfil() {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [comercio, setComercio] = useState(null);

  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  useEffect(() => {
    const cargarPerfil = async () => {
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
          setNombre(data.nombre || '');
        }
      } catch (error) {
        toast.error('Error al cargar los datos del perfil');
      } finally {
        setTimeout(() => setCargando(false), 500);
      }
    };
    cargarPerfil();
  }, []);

  const actualizarPerfil = async () => {
    // Validaciones básicas
    if (!nombre.trim()) return toast.error('El nombre no puede estar vacío');
    
    if (nuevaPassword) {
      if (nuevaPassword !== confirmarPassword) {
        return toast.error('Las contraseñas no coinciden');
      }
      if (nuevaPassword.length < 8) {
        return toast.error('La contraseña debe tener al menos 8 caracteres');
      }
    }

    setGuardando(true);
    const id = localStorage.getItem('comercioId');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${id}/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre,
          ...(nuevaPassword && { nuevaPassword }) // Solo enviamos la contraseña si el usuario escribió una
        })
      });

      if (res.ok) {
        toast.success('¡Perfil actualizado con éxito!');
        setNuevaPassword('');
        setConfirmarPassword('');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al actualizar');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <LoadingScreen />;

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-8">
      
      {/* CABECERA DINÁMICA */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-6 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-600/30 flex items-center justify-center text-white text-3xl font-black border-4 border-white">
            {nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{nombre}</h1>
            <p className="text-slate-500 font-medium">{comercio?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
              <Shield size={12} /> Plan {comercio?.plan_actual}
            </div>
          </div>
        </div>
        <button 
          onClick={actualizarPerfil}
          disabled={guardando}
          className="bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
        >
          {guardando ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {guardando ? 'Guardando...' : 'Actualizar Perfil'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* INFORMACIÓN DE LA CUENTA */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><User size={24} /></div>
            <h2 className="text-xl font-black text-slate-800">Datos Personales</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre Completo o Negocio</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Correo Electrónico (No editable)</label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></div>
                <input 
                  type="email" 
                  value={comercio?.email} 
                  disabled 
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-14 py-4 text-sm font-medium text-slate-400 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEGURIDAD */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Lock size={24} /></div>
            <h2 className="text-xl font-black text-slate-800">Seguridad</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nueva Contraseña</label>
              <input 
                type="password" 
                placeholder="Mínimo 8 caracteres"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Confirmar Contraseña</label>
              <input 
                type="password" 
                placeholder="Repite la contraseña"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700" 
              />
            </div>
          </div>
          <p className="mt-6 text-xs text-slate-400 font-medium flex items-center gap-2">
            <Shield size={14} className="text-blue-500" /> 
            Lumina Pay utiliza encriptación de grado bancario para proteger tus credenciales.
          </p>
        </div>

      </div>
    </div>
  );
}