import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, UserCog, Crown, Star, Trash2, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [comercios, setComercios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const cargarComercios = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/comercios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComercios(data);
      } else {
        toast.error("No tienes permisos de administrador");
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error("Error conectando con el servidor");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarComercios();
  }, []);

  const cambiarPlan = async (id, nuevoPlan) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/comercios/${id}/plan`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ nuevoPlan })
      });

      if (res.ok) {
        toast.success(`Plan actualizado a ${nuevoPlan.toUpperCase()}`);
        cargarComercios(); // Recargamos la lista
      }
    } catch (error) {
      toast.error("Error al actualizar el plan");
    }
  };

  const filtrados = comercios.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    c.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <ShieldCheck className="text-blue-600" size={32} />
          Panel de Control CEO
        </h1>
        <p className="text-slate-500 mt-1">Gestión global de comercios y suscripciones de Lumina Pay.</p>
      </div>

      {/* Buscador */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar comercio por nombre o correo..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
              <th className="p-4">Comercio / Registro</th>
              <th className="p-4">Plan Actual</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones de Suscripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrados.map((comercio) => (
              <tr key={comercio.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-800">{comercio.nombre}</p>
                  <p className="text-xs text-slate-400">{comercio.email}</p>
                  <p className="text-[10px] text-slate-300 mt-1">ID: {comercio.id}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase border ${
                    comercio.plan_actual === 'business' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                    comercio.plan_actual === 'pro' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {comercio.plan_actual}
                  </span>
                </td>
                <td className="p-4">
                  {comercio.verificado ? (
                    <span className="text-green-600 flex items-center gap-1 text-xs font-bold">
                      <ShieldCheck size={14} /> Verificado
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">Pendiente</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => cambiarPlan(comercio.id, 'starter')}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 title='Bajar a Starter'"
                    >
                      <UserCog size={18} />
                    </button>
                    <button 
                      onClick={() => cambiarPlan(comercio.id, 'pro')}
                      className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 title='Subir a Pro'"
                    >
                      <Star size={18} />
                    </button>
                    <button 
                      onClick={() => cambiarPlan(comercio.id, 'business')}
                      className="p-2 hover:bg-purple-100 rounded-lg text-purple-600 title='Subir a Business'"
                    >
                      <Crown size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}