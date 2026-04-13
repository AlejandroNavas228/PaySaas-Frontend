import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  // ==========================================
  // 1. ESTADOS (VARIABLES)
  // ==========================================
  const [comercio, setComercio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de la Interfaz (UX)
  const [showPassword, setShowPassword] = useState(false);
  const [inputEnFoco, setInputEnFoco] = useState(false);
  const [intentadoRegistrar, setIntentadoRegistrar] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // ==========================================
  // 2. LÓGICA DINÁMICA DE CONTRASEÑA
  // ==========================================
  const reqLongitud = password.length >= 8;
  const reqMayusMinus = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const reqNumero = /\d/.test(password);
  const reqEspecial = /[@$!%*?&#]/.test(password);

  const reglasCumplidas = [reqLongitud, reqMayusMinus, reqNumero, reqEspecial].filter(Boolean).length;

  // Cálculo visual de la barra de fuerza
  let colorBarra = "bg-slate-200";
  let anchoBarra = "w-0";
  if (password.length > 0) {
    if (reglasCumplidas <= 1) { colorBarra = "bg-red-500"; anchoBarra = "w-1/3"; }
    else if (reglasCumplidas <= 3) { colorBarra = "bg-yellow-400"; anchoBarra = "w-2/3"; }
    else if (reglasCumplidas === 4) { colorBarra = "bg-green-500"; anchoBarra = "w-full"; }
  }

  // Función para pintar el texto de las reglas
  const colorTextoRegla = (cumple) => {
    if (cumple) return "text-green-600 font-semibold";
    if (intentadoRegistrar && !cumple) return "text-red-500 font-semibold";
    return "text-slate-500";
  };

  // ==========================================
  // 3. ENVÍO DEL FORMULARIO
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIntentadoRegistrar(true);

    // Validaciones de seguridad antes de tocar el servidor
    if (reglasCumplidas < 4) {
      return toast.error('La contraseña es muy débil. Revisa los requisitos.');
    }
    if (password !== confirmPassword) {
      return toast.error('Las contraseñas no coinciden.');
    }

    // Iniciamos la carga
    setIsRegistering(true);
    const toastId = toast.loading('Creando tu cuenta...');

    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comercio, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Registro exitoso! Revisa tu correo.', { id: toastId });
        localStorage.setItem('emailPendiente', email);
        navigate('/verificar');
      } else {
        toast.error(data.error || 'No se pudo crear la cuenta.', { id: toastId });
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      toast.error('Error de conexión con el servidor.', { id: toastId });
    } finally {
      setIsRegistering(false);
    }
  };

  // ==========================================
  // 4. INTERFAZ VISUAL (HTML/JSX)
  // ==========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
        
        {/* Encabezado */}
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Únete a Lumi<span className="text-blue-600">na</span> y empieza a cobrar
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Nombre de la Tienda */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la Tienda</label>
            <input
              type="text"
              value={comercio}
              onChange={(e) => setComercio(e.target.value)}
              placeholder="Ej. Mi Tienda Online"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              required
            />
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mitienda.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              required
            />
          </div>

          {/* Contraseña Principal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="flex flex-col">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setInputEnFoco(true)}
                  onBlur={() => setInputEnFoco(false)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="Crea una contraseña segura"
                  required
                />
                
                <button
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Acordeón de Reglas de Contraseña */}
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  (inputEnFoco || password.length > 0 || intentadoRegistrar) 
                    ? 'max-h-60 opacity-100 mt-3' 
                    : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ease-out ${colorBarra} ${anchoBarra}`}></div>
                </div>

                <div className="text-[11px] sm:text-xs flex flex-col gap-1 mt-2">
                  <p className="font-semibold text-slate-700 mb-1">Tu contraseña debe contener al menos:</p>
                  <div className={`flex items-center gap-2 transition-colors ${colorTextoRegla(reqLongitud)}`}>
                    <span>{reqLongitud ? '✓' : (intentadoRegistrar ? '✕' : '•')}</span>
                    <span>8 caracteres</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${colorTextoRegla(reqMayusMinus)}`}>
                    <span>{reqMayusMinus ? '✓' : (intentadoRegistrar ? '✕' : '•')}</span>
                    <span>Una letra mayúscula y una minúscula</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${colorTextoRegla(reqNumero)}`}>
                    <span>{reqNumero ? '✓' : (intentadoRegistrar ? '✕' : '•')}</span>
                    <span>Un número</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${colorTextoRegla(reqEspecial)}`}>
                    <span>{reqEspecial ? '✓' : (intentadoRegistrar ? '✕' : '•')}</span>
                    <span>Un carácter especial (ej. @, $, !, %, *, ?, &, #)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              required
            />
          </div>

          {/* Botón de Submit */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isRegistering}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all ${isRegistering ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
            >
              {isRegistering ? 'Procesando...' : 'Registrar mi negocio'}
            </button>
          </div>
        </form>

        {/* Pie de página */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">¿Ya tienes una cuenta? </span>
          <button 
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Inicia sesión aquí
          </button>
        </div>
        
      </div>
    </div>
  );
}