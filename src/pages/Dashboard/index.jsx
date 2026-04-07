import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, ArrowUpRight, Activity, CreditCard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [transacciones, setTransacciones] = useState([]);
  const [metricas, setMetricas] = useState({
    ingresos: 0,
    pendientes: 0,
    totalVentas: 0
  });

  const nombreComercio = localStorage.getItem('comercioNombre') || 'Comercio';

  useEffect(() => {
    const cargarDatos = async () => {
      const comercioId = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token');

      if (!comercioId || !token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/pagos/${comercioId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTransacciones(data.slice(0, 5)); // Solo mostramos las 5 más recientes
          
          // Calculamos las métricas
          let ingresosTotales = 0;
          let pagosPendientes = 0;

          data.forEach(tx => {
            if (tx.estado === 'aprobado') ingresosTotales += parseFloat(tx.monto);
            if (tx.estado === 'en_revision' || tx.estado === 'pendiente') pagosPendientes++;
          });

          setMetricas({
            ingresos: ingresosTotales.toFixed(2),
            pendientes: pagosPendientes,
            totalVentas: data.filter(tx => tx.estado === 'aprobado').length
          });
        }
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar el dashboard');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  if (cargando) return <div className="h-full flex justify-center items-center"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      
      {/* Saludo */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">¡Hola, {nombreComercio}! 👋</h1>
          <p className="text-slate-500">Aquí tienes un resumen de tu negocio el día de hoy.</p>
        </div>
        <button onClick={() => navigate('/transacciones')} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">
          Ver reporte completo
        </button>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Ingresos Totales */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><DollarSign size={24} /></div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg"><ArrowUpRight size={14} /> +12%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1 relative z-10">Ingresos Totales</p>
          <h2 className="text-3xl font-bold text-slate-800 relative z-10">${metricas.ingresos}</h2>
        </div>

        {/* Pagos Pendientes (Llamado a la acción) */}
        <div className={`p-6 rounded-2xl shadow-sm border transition-colors ${metricas.pendientes > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${metricas.pendientes > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}><Clock size={24} /></div>
          </div>
          <p className={`text-sm font-medium mb-1 ${metricas.pendientes > 0 ? 'text-orange-600' : 'text-slate-500'}`}>Pagos por Revisar</p>
          <div className="flex items-end justify-between">
            <h2 className={`text-3xl font-bold ${metricas.pendientes > 0 ? 'text-orange-700' : 'text-slate-800'}`}>{metricas.pendientes}</h2>
            {metricas.pendientes > 0 && (
              <button onClick={() => navigate('/transacciones')} className="text-xs font-bold bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors">
                Revisar ahora
              </button>
            )}
          </div>
        </div>

        {/* Total de Ventas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Activity size={24} /></div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Ventas Exitosas</p>
          <h2 className="text-3xl font-bold text-slate-800">{metricas.totalVentas}</h2>
        </div>

      </div>

      {/* Actividad Reciente */}
      <h3 className="text-lg font-bold text-slate-800 mb-4">Actividad Reciente</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {transacciones.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <CreditCard size={48} className="mx-auto mb-3 opacity-50" />
            <p>Aún no tienes ventas registradas.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transacciones.map(tx => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${tx.estado === 'aprobado' ? 'bg-green-100 text-green-600' : tx.estado === 'en_revision' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{tx.descripcion || 'Cobro de producto'}</p>
                    <p className="text-xs text-slate-400">{new Date(tx.fecha).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">${tx.monto}</p>
                  <p className={`text-xs font-bold capitalize ${tx.estado === 'aprobado' ? 'text-green-600' : tx.estado === 'en_revision' ? 'text-orange-600' : 'text-slate-500'}`}>
                    {tx.estado.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}