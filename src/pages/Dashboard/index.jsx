import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, ArrowUpRight, Activity, Loader2, Link as LinkIcon, Code, Rocket, Star, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import TransactionsTable from '../../components/ui/TransactionsTable';

const DashboardSkeleton = () => (
  <div className="max-w-6xl mx-auto pb-10 space-y-8 animate-pulse">
    <div className="w-1/3 h-10 bg-slate-200 rounded-lg mb-2"></div>
    <div className="w-full h-20 bg-slate-200 rounded-2xl mb-8"></div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-32 bg-slate-200 rounded-2xl"></div>
      <div className="h-32 bg-slate-200 rounded-2xl"></div>
      <div className="h-32 bg-slate-200 rounded-2xl"></div>
    </div>
    
    <div className="h-64 bg-slate-200 rounded-2xl"></div>
  </div>
);

// 👑 NUEVO COMPONENTE: El Banner de Celebración
const BannerPremium = ({ plan }) => {
  if (!plan || plan === 'starter') return null; // Si es starter, no mostramos banner premium

  if (plan === 'business') {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl mb-8 shadow-lg shadow-purple-500/20 border border-purple-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
            <Rocket className="text-white" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              ¡Felicidades! Tu Plan BUSINESS está activo <ShieldCheck size={18} className="text-purple-200"/>
            </h3>
            <p className="text-purple-100 text-sm mt-1">Tu cuenta está operando al máximo nivel con todos los beneficios y sin límites.</p>
          </div>
        </div>
        <span className="bg-white text-purple-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm whitespace-nowrap">
          Cuenta Élite
        </span>
      </div>
    );
  }

  if (plan === 'pro') {
    return (
      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-6 rounded-2xl mb-8 shadow-lg shadow-yellow-500/20 border border-yellow-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
            <Star className="text-white" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              ¡Excelente! Tu Plan PRO está activo
            </h3>
            <p className="text-yellow-50 text-sm mt-1">Has desbloqueado las funciones profesionales para tu negocio.</p>
          </div>
        </div>
        <span className="bg-white text-amber-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm whitespace-nowrap">
          Cuenta PRO
        </span>
      </div>
    );
  }

  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [transacciones, setTransacciones] = useState([]);
  const [comercio, setComercio] = useState(null); // Añadimos estado para guardar los datos del comercio
  
  const [metricas, setMetricas] = useState({
    ingresos: 0,
    pendientes: 0,
    totalVentas: 0
  });

  const [linkMonto, setLinkMonto] = useState('');
  const [linkConcepto, setLinkConcepto] = useState('');
  const [linkGenerado, setLinkGenerado] = useState('');
  const [generandoLink, setGenerandoLink] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const comercioId = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token');

      if (!comercioId || !token) {
        navigate('/login');
        return;
      }

      try {
        // 💡 Hacemos DOS llamadas: Una para los pagos y otra para ver qué plan tiene el usuario HOY
        const [resPagos, resComercio] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/pagos/${comercioId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${comercioId}`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        if (resPagos.ok && resComercio.ok) {
          const dataPagos = await resPagos.json();
          const dataComercio = await resComercio.json();
          
          setTransacciones(dataPagos); 
          setComercio(dataComercio); // Guardamos el plan actualizado
          
          let ingresosTotales = 0;
          let pagosPendientes = 0;

          dataPagos.forEach(tx => {
            if (tx.estado === 'aprobado') ingresosTotales += parseFloat(tx.monto);
            if (tx.estado === 'en_revision' || tx.estado === 'pendiente') pagosPendientes++;
          });

          setMetricas({
            ingresos: ingresosTotales.toFixed(2),
            pendientes: pagosPendientes,
            totalVentas: dataPagos.filter(tx => tx.estado === 'aprobado').length
          });
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al sincronizar con el servidor');
      } finally {
        setTimeout(() => setCargando(false), 600);
      }
    };

    cargarDatos();
  }, [navigate]);

  const generarLinkRapido = async () => {
    if (!linkMonto || !linkConcepto) return toast.error('Llena el monto y el concepto');
    setGenerandoLink(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': localStorage.getItem('apiKey') 
        },
        body: JSON.stringify({
          monto: parseFloat(linkMonto),
          descripcion: linkConcepto,
          referenciaComercio: `LINK-${Math.floor(Math.random() * 10000)}`
        })
      });

      const data = await response.json();
      if (response.ok) {
        setLinkGenerado(data.url_pago);
        toast.success('¡Link generado con éxito!');
      } else {
        toast.error(data.error || 'Error al generar el link');
      }
    } catch (error) {
      console.error('Error de red:', error);
      toast.error('Error de red');
    } finally {
      setGenerandoLink(false);
    }
  };

  const copiarAlPortapapeles = (texto) => {
    navigator.clipboard.writeText(texto);
    toast.success('¡Copiado!');
  };

  if (cargando) return <DashboardSkeleton />;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <Toaster position="top-right" />
      
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">¡Hola, {comercio?.nombre || 'Comercio'}! 👋</h1>
          <p className="text-slate-500">Aquí tienes un resumen de tu negocio el día de hoy.</p>
        </div>
      </div>

      {/* 🚀 AQUÍ SE INYECTA EL BANNER MÁGICAMENTE SI EL PLAN ES PRO O BUSINESS */}
      <BannerPremium plan={comercio?.plan_actual} />

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><DollarSign size={24} /></div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg"><ArrowUpRight size={14} /> Activo</span>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1 relative z-10">Ingresos Totales</p>
          <h2 className="text-3xl font-bold text-slate-800 relative z-10">${metricas.ingresos}</h2>
        </div>

        <div className={`p-6 rounded-2xl shadow-sm border transition-colors ${metricas.pendientes > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${metricas.pendientes > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}><Clock size={24} /></div>
          </div>
          <p className={`text-sm font-medium mb-1 ${metricas.pendientes > 0 ? 'text-orange-600' : 'text-slate-500'}`}>Pagos por Revisar</p>
          <div className="flex items-end justify-between">
            <h2 className={`text-3xl font-bold ${metricas.pendientes > 0 ? 'text-orange-700' : 'text-slate-800'}`}>{metricas.pendientes}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Activity size={24} /></div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Ventas Exitosas</p>
          <h2 className="text-3xl font-bold text-slate-800">{metricas.totalVentas}</h2>
        </div>
      </div>

      {/* Generador de Links */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><LinkIcon size={20} /></div>
          <h2 className="text-xl font-bold text-slate-800">Generador Rápido de Pagos</h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">Crea un link de cobro instantáneo para enviar por WhatsApp o integrar en tu web.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Concepto / Producto</label>
            <input 
              type="text" placeholder="Ej: Zapatos Deportivos Blancos" 
              value={linkConcepto} onChange={(e) => setLinkConcepto(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Monto a cobrar (USD)</label>
            <input 
              type="number" placeholder="Ej: 25.50" 
              value={linkMonto} onChange={(e) => setLinkMonto(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-sm" 
            />
          </div>
        </div>

        <button 
          onClick={generarLinkRapido} disabled={generandoLink}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {generandoLink ? <Loader2 className="animate-spin" size={18} /> : 'Generar Link de Pago'}
        </button>

        {linkGenerado && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" readOnly value={linkGenerado} className="flex-1 text-sm bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none text-blue-600 font-medium" />
                <button onClick={() => copiarAlPortapapeles(linkGenerado)} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors whitespace-nowrap">Copiar Link</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de Transacciones */}
      <h3 className="text-lg font-bold text-slate-800 mb-4">Actividad Reciente</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <TransactionsTable transacciones={transacciones.slice(0, 5)} setTransacciones={setTransacciones} />
      </div>

    </div>
  );
}