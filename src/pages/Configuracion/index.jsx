import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Key, Copy, Eye, EyeOff, Store, Mail, ShieldAlert } from 'lucide-react';

export default function Configuracion() {
  const [comercio, setComercio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarKey, setMostrarKey] = useState(false);
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
          setComercio(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar la configuración');
      } finally {
        setIsLoading(false);
      }
    };
    obtenerDatos();
  }, [navigate]);

  const copiarAlPortapapeles = () => {
    if (comercio?.api_key) {
      navigator.clipboard.writeText(comercio.api_key);
      toast.success('¡API Key copiada al portapapeles!');
    }
  };

  if (isLoading) {
    return <div className="p-10 text-slate-500 font-medium animate-pulse">Cargando credenciales seguras...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-4xl">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Configuración</h1>
        <p className="text-slate-500 text-sm mt-1">Gestiona las credenciales de conexión para tu tienda.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Store className="text-blue-600" size={20} />
            Datos del Negocio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre de la Tienda</label>
              <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium">
                {comercio?.nombre}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correo Administrador</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium">
                <Mail size={16} className="text-slate-400" />
                {comercio?.email}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Key className="text-indigo-600" size={20} />
            Credenciales de Integración (API Key)
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-2xl">
            Utiliza esta llave secreta en tu página web para conectar tu sistema de cobros con Lumina. 
            <span className="font-bold text-red-500"> Nunca compartas esta llave en público.</span>
          </p>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden w-full">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Llave Secreta (Live)</label>
              <div className="font-mono text-sm sm:text-base text-slate-800 break-all bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                {mostrarKey ? comercio?.api_key : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <button 
                onClick={() => setMostrarKey(!mostrarKey)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                {mostrarKey ? <><EyeOff size={16}/> Ocultar</> : <><Eye size={16}/> Revelar</>}
              </button>
              <button 
                onClick={copiarAlPortapapeles}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm shadow-blue-600/20 transition-all"
              >
                <Copy size={16} /> Copiar
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200/50">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-amber-800 font-medium">
              Cualquier transacción realizada con esta API Key afectará el balance de "{comercio?.nombre}". Si crees que ha sido comprometida, contacta a soporte inmediatamente para regenerarla.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}