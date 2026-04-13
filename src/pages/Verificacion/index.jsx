import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, KeyRound, ArrowRight } from 'lucide-react';

export default function Verificacion() {
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  
  // Buscamos el correo que la persona acaba de usar para registrarse o intentar loguearse
  const email = localStorage.getItem('emailPendiente');

  // Si alguien entra aquí sin un correo previo, lo devolvemos al login
  if (!email) {
    navigate('/login');
    return null;
  }

  const handleVerificar = async (e) => {
    e.preventDefault();
    if (codigo.length !== 6) {
      return toast.error('El código debe tener 6 dígitos');
    }

    setCargando(true);
    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Cuenta verificada exitosamente!');
        localStorage.removeItem('emailPendiente'); // Limpiamos la memoria
        navigate('/login'); // Lo mandamos a que inicie sesión ya activado
      } else {
        toast.error(data.error || 'Código incorrecto');
      }
    } catch (error) {
        console.error(error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 animate-fade-in">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
          <Mail size={32} />
        </div>
        
        <h2 className="text-2xl font-extrabold text-slate-800 text-center mb-2">Revisa tu correo</h2>
        <p className="text-slate-500 text-center text-sm mb-6">
          Hemos enviado un código de seguridad de 6 dígitos a <br/>
          <strong className="text-slate-700">{email}</strong>
        </p>

        <form onSubmit={handleVerificar} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <KeyRound size={20} className="text-slate-400" />
            </div>
            <input
              type="text"
              maxLength="6"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/[^0-9]/g, ''))} // Solo permite números
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-center text-2xl tracking-widest text-slate-800"
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={cargando || codigo.length !== 6}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
          >
            {cargando ? 'Verificando...' : 'Activar mi cuenta'}
            {!cargando && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}