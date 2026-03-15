import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Calendar, ShieldCheck, Edit3 } from 'lucide-react';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      const comercioId = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token');

      if (!comercioId || !token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/comercio/${comercioId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };
    obtenerDatos();
  }, [navigate]);

  if (isLoading) {
    return <div className="p-10 text-slate-500 font-medium animate-pulse">Cargando perfil...</div>;
  }

  // Formateamos la fecha en la que se registró
  const fechaRegistro = new Date(usuario?.createdAt).toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-3xl mx-auto">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mi Perfil</h1>
        <p className="text-slate-500 text-sm mt-1">Gestiona tu información personal y preferencias de cuenta.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        {/* Banner de fondo decorativo */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="px-8 pb-8 relative">
          {/* Foto de perfil superpuesta */}
          <div className="flex justify-between items-end -mt-12 mb-8">
            <div className="h-24 w-24 bg-white rounded-full p-1.5 shadow-lg">
              <div className="h-full w-full bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold uppercase">
                {usuario?.nombre.charAt(0)}
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 rounded-xl font-semibold transition-colors text-sm">
              <Edit3 size={16} />
              Editar Perfil
            </button>
          </div>

          {/* Información del Usuario */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Nombre Completo
                </label>
                <p className="text-lg font-bold text-slate-800">{usuario?.nombre}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={14} /> Correo Electrónico
                </label>
                <p className="text-lg font-bold text-slate-800">{usuario?.email}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={14} /> Nivel de Acceso
                </label>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm border border-blue-100">
                  Administrador Total
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} /> Miembro desde
                </label>
                <p className="text-lg font-bold text-slate-800 capitalize">{fechaRegistro}</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}