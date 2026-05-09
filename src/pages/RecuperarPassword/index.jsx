import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

export default function RecuperarPassword() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1); // 1 = Pedir Email | 2 = Pedir Código y Nueva Contraseña
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  // 📩 ENVIAR CORREO
  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Ingresa tu correo electrónico");
    
    setCargando(true);
    try {
      // 💡 AQUÍ ESTÁ EL ARREGLO DE LAS COMILLAS (Usamos acentos graves ` `)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recuperar-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.mensaje || 'Revisa tu bandeja de entrada');
        setPaso(2); // Pasamos a la siguiente pantalla
      } else {
        toast.error(data.error || 'Error al solicitar recuperación');
      }
    } catch (error) {
      toast.error('Error de red. Verifica tu conexión.');
    } finally {
      setCargando(false);
    }
  };

  // 🔑 CAMBIAR CONTRASEÑA
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (nuevaPassword !== confirmarPassword) {
      return toast.error("Las contraseñas no coinciden");
    }

    setCargando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo, nuevaPassword })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('¡Contraseña cambiada con éxito!', { duration: 4000 });
        navigate('/login'); // Lo mandamos a iniciar sesión
      } else {
        toast.error(data.error || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      toast.error('Error de red al intentar conectar.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        
        <button 
          onClick={() => paso === 2 ? setPaso(1) : navigate('/login')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {paso === 1 ? 'Recuperar Cuenta' : 'Nueva Contraseña'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            {paso === 1 
              ? 'Ingresa tu correo y te enviaremos un código de seguridad.' 
              : `Ingresa el código que enviamos a ${email}`}
          </p>
        </div>

        {paso === 1 ? (
          // ================= PASO 1: PEDIR CORREO =================
          <form onSubmit={handleSolicitarCodigo} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all bg-slate-50 focus:bg-white"
                  placeholder="ejemplo@mitienda.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {cargando ? <Loader2 size={20} className="animate-spin" /> : <KeyRound size={20} />}
              {cargando ? 'Enviando...' : 'Enviar Código'}
            </button>
          </form>
        ) : (
          // ================= PASO 2: CÓDIGO Y NUEVA CONTRASEÑA =================
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Código de 6 dígitos</label>
              <input
                type="text"
                required
                maxLength="6"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-center tracking-[0.5em] text-lg font-bold text-slate-800 transition-all bg-slate-50 focus:bg-white"
                placeholder="000000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nueva Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  required
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition-all bg-slate-50 focus:bg-white"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  required
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition-all bg-slate-50 focus:bg-white"
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {cargando ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />}
              {cargando ? 'Guardando...' : 'Restablecer Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}