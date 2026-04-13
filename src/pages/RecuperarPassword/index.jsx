import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, KeyRound, Lock, ArrowRight } from 'lucide-react';

export default function RecuperarPassword() {
  const [paso, setPaso] = useState(1); // Paso 1: Pedir correo | Paso 2: Pedir código y nueva clave
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();

  // Función para pedir el código (Paso 1)
  const handlePedirCodigo = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Ingresa tu correo');

    setCargando(true);
    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        toast.success('Si el correo existe, te enviamos un código.');
        setPaso(2); // Pasamos a la siguiente pantalla
      } else {
        toast.error('Hubo un error al procesar la solicitud.');
      }
    } catch (error) {
        console.error(error);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  // Función para cambiar la contraseña (Paso 2)
  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    if (codigo.length !== 6) return toast.error('El código debe tener 6 dígitos');
    if (nuevaPassword.length < 6) return toast.error('La contraseña debe tener al menos 6 caracteres');

    setCargando(true);
    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/restablecer-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo, nuevaPassword })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Contraseña actualizada con éxito!');
        navigate('/login'); // Lo mandamos a iniciar sesión con su nueva clave
      } else {
        toast.error(data.error || 'Código incorrecto');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 animate-fade-in">
        
        {/* --- PASO 1: PEDIR CORREO --- */}
        {paso === 1 && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 text-center mb-2">Recuperar Acceso</h2>
            <p className="text-slate-500 text-center text-sm mb-6">
              Ingresa el correo de tu cuenta y te enviaremos un código de seguridad para crear una nueva contraseña.
            </p>

            <form onSubmit={handlePedirCodigo} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-blue-400"
              >
                {cargando ? 'Enviando...' : 'Enviar Código'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-blue-600 font-semibold hover:underline">
                Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}

        {/* --- PASO 2: INGRESAR CÓDIGO Y NUEVA CLAVE --- */}
        {paso === 2 && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <KeyRound size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 text-center mb-2">Crea tu nueva clave</h2>
            <p className="text-slate-500 text-center text-sm mb-6">
              Ingresa el código que enviamos a <strong>{email}</strong>
            </p>

            <form onSubmit={handleCambiarPassword} className="space-y-4">
              {/* Input del Código */}
              <input
                type="text"
                maxLength="6"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-center text-2xl tracking-widest text-slate-800"
                placeholder="••••••"
                required
              />

              {/* Input de Nueva Contraseña */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tu nueva contraseña"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={cargando || codigo.length !== 6 || nuevaPassword.length < 6}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center justify-center gap-2"
              >
                {cargando ? 'Actualizando...' : 'Actualizar Contraseña'}
                {!cargando && <ArrowRight size={18} />}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}