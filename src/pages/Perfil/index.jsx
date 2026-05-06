import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Loader2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: '',
    email: '', // El email será de solo lectura por ahora
  });

  const [seguridad, setSeguridad] = useState({
    nuevaPassword: '',
    confirmarPassword: ''
  });

  // 1. Cargar los datos actuales del usuario al entrar a la página
  useEffect(() => {
    const comercioGuardado = localStorage.getItem('comercio');
    
    if (comercioGuardado) {
      const parsedComercio = JSON.parse(comercioGuardado);
      setDatosPerfil({
        nombre: parsedComercio.nombre || '',
        email: parsedComercio.email || '',
      });
      setCargando(false);
    } else {
      // Si por alguna razón no hay datos, lo mandamos al login
      navigate('/login');
    }
  }, [navigate]);

  // 2. Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const comercioId = localStorage.getItem('comercioId');
    const token = localStorage.getItem('token');

    // Validación de contraseñas si el usuario intentó cambiarla
    if (seguridad.nuevaPassword) {
      if (seguridad.nuevaPassword !== seguridad.confirmarPassword) {
        return toast.error('Las contraseñas no coinciden.');
      }
      if (seguridad.nuevaPassword.length < 8) {
        return toast.error('La contraseña debe tener al menos 8 caracteres.');
      }
    }

    if (!datosPerfil.nombre.trim()) {
      return toast.error('El nombre no puede estar vacío.');
    }

    setGuardando(true);

    try {
      // Preparamos el paquete de datos a enviar
      const payload = { nombre: datosPerfil.nombre };
      if (seguridad.nuevaPassword) {
        payload.nuevaPassword = seguridad.nuevaPassword;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${comercioId}/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Perfil actualizado con éxito!');
        
        // Actualizamos el nombre en el localStorage para que el menú lateral cambie
        const comercioActual = JSON.parse(localStorage.getItem('comercio'));
        comercioActual.nombre = data.comercio.nombre;
        localStorage.setItem('comercio', JSON.stringify(comercioActual));

        // Limpiamos los campos de contraseña
        setSeguridad({ nuevaPassword: '', confirmarPassword: '' });
      } else {
        toast.error(data.error || 'Error al actualizar el perfil.');
      }
    } catch (error) {
      console.error("Error de red:", error);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Mi Perfil</h1>
        <p className="text-slate-500 mt-1">Gestiona tu información personal y la seguridad de tu cuenta.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECCIÓN: INFORMACIÓN BÁSICA */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Información General
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre del Comercio / Propietario</label>
              <input 
                type="text" 
                value={datosPerfil.nombre}
                onChange={(e) => setDatosPerfil({...datosPerfil, nombre: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm font-medium text-slate-800"
                placeholder="Ej: Tienda de Zapatos CA"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Electrónico</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={datosPerfil.email}
                  readOnly
                  disabled
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed"
                />
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={16} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">* Por seguridad, el correo no se puede cambiar.</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN: SEGURIDAD Y CONTRASEÑA */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Lock className="text-amber-500" size={20} />
            Seguridad (Opcional)
          </h2>
          
          <p className="text-sm text-slate-500 mb-6">Solo llena estos campos si deseas cambiar tu contraseña actual.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nueva Contraseña</label>
              <input 
                type="password" 
                value={seguridad.nuevaPassword}
                onChange={(e) => setSeguridad({...seguridad, nuevaPassword: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-all text-sm"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirmar Nueva Contraseña</label>
              <input 
                type="password" 
                value={seguridad.confirmarPassword}
                onChange={(e) => setSeguridad({...seguridad, confirmarPassword: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-all text-sm"
                placeholder="Repite tu nueva contraseña"
              />
            </div>
          </div>
        </div>

        {/* BOTÓN DE GUARDAR */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={guardando}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {guardando ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {guardando ? 'Guardando Cambios...' : 'Guardar Perfil'}
          </button>
        </div>

      </form>
    </div>
  );
}