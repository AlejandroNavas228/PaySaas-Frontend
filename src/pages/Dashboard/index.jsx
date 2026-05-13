import React, { useState, useEffect } from 'react';
import { DollarSign, Wallet, Clock, ArrowUpRight, Activity, Loader2, Link as LinkIcon, Rocket, Star, ShieldCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingScreen from '../../components/ui/LoadingScreen';
import TransactionsTable from '../../components/ui/TransactionsTable';

// 💡 IMPORTAMOS NUESTRO NUEVO CEREBRO
import { api } from '../../services/api';

const tienePermiso = (planUsuario, planRequerido) => {
  const niveles = { 'starter': 0, 'pro': 1, 'business': 2 };
  const nivelActual = niveles[planUsuario] || 0; 
  return nivelActual >= niveles[planRequerido];
};

const BannerPremium = ({ plan }) => {
  if (!plan || plan === 'starter') return null;

  if (plan === 'business') {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-[2rem] mb-8 shadow-xl shadow-purple-500/20 border border-purple-400/30 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-5">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <Rocket className="text-white" size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              ¡Felicidades! Tu Plan BUSINESS está activo <ShieldCheck size={20} className="text-purple-200"/>
            </h3>
            <p className="text-purple-100 text-sm mt-1 font-medium">Tu cuenta está operando al máximo nivel con todos los beneficios y sin límites.</p>
          </div>
        </div>
        <span className="bg-white text-purple-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm whitespace-nowrap">
          Cuenta Élite
        </span>
      </div>
    );
  }

  if (plan === 'pro') {
    return (
      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-8 rounded-[2rem] mb-8 shadow-xl shadow-yellow-500/20 border border-yellow-400/30 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-5">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <Star className="text-white" size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              ¡Excelente! Tu Plan PRO está activo
            </h3>
            <p className="text-yellow-50 text-sm mt-1 font-medium">Has desbloqueado las funciones profesionales para tu negocio.</p>
          </div>
        </div>
        <span className="bg-white text-amber-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm whitespace-nowrap">
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
  const [comercio, setComercio] = useState(null);
  
  const [metricas, setMetricas] = useState({
    ingresos: 0,
    pendientes: 0,
    totalVentas: 0
  });

  const [linkMonto, setLinkMonto] = useState('');
  const [linkConcepto, setLinkConcepto] = useState('');
  const [linkUrlExito, setLinkUrlExito] = useState('');
  const [linkGenerado, setLinkGenerado] = useState('');
  const [generandoLink, setGenerandoLink] = useState(false);

  // 1. CARGA DE DATOS OPTIMIZADA CON EL SERVICIO API
  useEffect(() => {
    const cargarDatos = async () => {
      const comercioId = localStorage.getItem('comercioId');
      if (!comercioId) return navigate('/login');

      try {
        // 💡 MAGIA: Promise.all súper limpio sin tener que escribir 'fetch' ni 'headers'
        const [dataPagos, dataComercio] = await Promise.all([
          api.obtenerTransacciones(comercioId),
          api.obtenerComercio(comercioId)
        ]);
        
        setTransacciones(dataPagos); 
        setComercio(dataComercio);
        
        let ingresosTotales = 0; let pagosPendientes = 0;
        dataPagos.forEach(tx => {
          if (tx.estado === 'aprobado') ingresosTotales += parseFloat(tx.monto);
          if (tx.estado === 'en_revision' || tx.estado === 'pendiente') pagosPendientes++;
        });

        setMetricas({
          ingresos: ingresosTotales.toFixed(2),
          pendientes: pagosPendientes,
          totalVentas: dataPagos.filter(tx => tx.estado === 'aprobado').length
        });
        
      } catch (error) {
        toast.error(error.message || 'Error al sincronizar con el servidor');
      } finally {
        setTimeout(() => setCargando(false), 600);
      }
    };
    
    cargarDatos();
  }, [navigate]);

  // 2. GENERACIÓN DE LINKS OPTIMIZADA
  const generarLinkRapido = async () => {
    if (!linkMonto || !linkConcepto) return toast.error('Llena el monto y el concepto');
    if (!comercio?.api_key) return toast.error('Cargando credenciales de seguridad... intenta de nuevo.');

    setGenerandoLink(true);
    
    try {
      const payload = {
        monto: parseFloat(linkMonto),
        descripcion: linkConcepto,
        referenciaComercio: `LINK-${Math.floor(Math.random() * 10000)}`
      };

      if (tienePermiso(comercio?.plan_actual, 'pro') && linkUrlExito) {
        payload.urlExito = linkUrlExito;
      }

      // 💡 MAGIA: Pasamos la api_key y el payload, la API hace el resto
      const data = await api.generarLink(comercio.api_key, payload);
      
      setLinkGenerado(data.url_pago);
      toast.success('¡Link generado con éxito!');
      setLinkUrlExito(''); 
      
    } catch (error) {
      toast.error(error.message || 'Error al generar el link');
    } finally {
      setGenerandoLink(false);
    }
  };

  const copiarAlPortapapeles = (texto) => {
    navigator.clipboard.writeText(texto);
    toast.success('¡Copiado!');
  };

  if (cargando) return <LoadingScreen />;

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-8">
      
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
          ¡Hola, {comercio?.nombre || 'Comercio'}! 👋
        </h1>
        <p className="text-slate-500 font-medium">Aquí tienes un resumen de tu negocio el día de hoy.</p>
      </div>

      <BannerPremium plan={comercio?.plan_actual} />

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* TARJETA 1: DARK MODE */}
        <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-xl relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl"><DollarSign size={24} /></div>
              <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Ingresos Totales</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
              <ArrowUpRight size={14} /> Activo
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white relative z-10">${metricas.ingresos}</h2>
        </div>

        {/* TARJETA 2: PENDIENTES */}
        <div className={`rounded-[2rem] p-8 shadow-sm border transition-all duration-300 hover:shadow-md ${metricas.pendientes > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-xl ${metricas.pendientes > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
              <Clock size={24} />
            </div>
            <span className={`font-bold text-sm uppercase tracking-wider ${metricas.pendientes > 0 ? 'text-orange-600' : 'text-slate-500'}`}>
              Por Revisar
            </span>
          </div>
          <h2 className={`text-4xl lg:text-5xl font-black ${metricas.pendientes > 0 ? 'text-orange-700' : 'text-slate-900'}`}>
            {metricas.pendientes}
          </h2>
          <p className={`text-sm mt-3 font-medium ${metricas.pendientes > 0 ? 'text-orange-600/80' : 'text-slate-400'}`}>
            Pagos esperando tu aprobación
          </p>
        </div>

        {/* TARJETA 3: VENTAS EXITOSAS */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Activity size={24} /></div>
            <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Ventas Exitosas</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900">{metricas.totalVentas}</h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">Transacciones completadas</p>
        </div>
      </div>

      {/* GENERADOR RÁPIDO DE PAGOS */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><LinkIcon size={20} /></div>
          <h2 className="text-xl font-black text-slate-800">Generador Rápido de Pagos</h2>
        </div>
        <p className="text-sm text-slate-500 font-medium mb-8">Crea un link de cobro instantáneo para enviar por WhatsApp o integrar en tu web.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Concepto / Producto</label>
            <input 
              type="text" placeholder="Ej: Zapatos Deportivos Blancos" 
              value={linkConcepto} onChange={(e) => setLinkConcepto(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Monto a cobrar (USD)</label>
            <input 
              type="number" placeholder="Ej: 25.50" 
              value={linkMonto} onChange={(e) => setLinkMonto(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700" 
            />
          </div>
        </div>

        <div className={`mb-8 ${tienePermiso(comercio?.plan_actual, 'pro') ? "" : "opacity-60"}`}>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
            URL de Redirección (Éxito) 
            {!tienePermiso(comercio?.plan_actual, 'pro') && <Lock size={12} className="text-amber-500" />}
          </label>
          <input 
            type="text" 
            placeholder="https://tuweb.com/gracias" 
            value={linkUrlExito} 
            onChange={(e) => setLinkUrlExito(e.target.value)}
            disabled={!tienePermiso(comercio?.plan_actual, 'pro')}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" 
          />
          {!tienePermiso(comercio?.plan_actual, 'pro') && (
            <p className="text-xs text-amber-600 font-bold mt-2">
              ✨ Función bloqueada. Mejora al Plan PRO para redirigir a tus clientes a tu tienda tras el pago.
            </p>
          )}
        </div>

        <button 
          onClick={generarLinkRapido} disabled={generandoLink}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {generandoLink ? <Loader2 className="animate-spin" size={20} /> : <LinkIcon size={20} />}
          {generandoLink ? 'Procesando...' : 'Generar Link de Pago'}
        </button>

        {linkGenerado && (
          <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" readOnly value={linkGenerado} className="flex-1 text-sm bg-white border border-blue-200 rounded-xl px-5 py-3 outline-none text-blue-700 font-bold" />
                <button onClick={() => copiarAlPortapapeles(linkGenerado)} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                  Copiar Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABLA DE TRANSACCIONES */}
      <h3 className="text-2xl font-black text-slate-800 mb-6 px-1">Actividad Reciente</h3>
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <TransactionsTable transacciones={transacciones.slice(0, 5)} setTransacciones={setTransacciones} />
      </div>

    </div>
  );
}