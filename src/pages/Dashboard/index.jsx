import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, ArrowUpRight, Activity, CreditCard, Loader2, Link as LinkIcon, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import TransactionsTable from '../../components/ui/TransactionsTable'; // Asegúrate de tener este import

// ---> 1. SKELETON LOADER (Adaptado a tu diseño claro) <---
const DashboardSkeleton = () => (
  <div className="max-w-6xl mx-auto pb-10 space-y-8 animate-pulse">
    <div className="w-1/3 h-10 bg-slate-200 rounded-lg mb-2"></div>
    <div className="w-1/4 h-4 bg-slate-200 rounded-lg mb-8"></div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-32 bg-slate-200 rounded-2xl"></div>
      <div className="h-32 bg-slate-200 rounded-2xl"></div>
      <div className="h-32 bg-slate-200 rounded-2xl"></div>
    </div>
    
    <div className="h-64 bg-slate-200 rounded-2xl"></div>
    <div className="h-80 bg-slate-200 rounded-2xl"></div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [transacciones, setTransacciones] = useState([]);
  const [metricas, setMetricas] = useState({
    ingresos: 0,
    pendientes: 0,
    totalVentas: 0
  });

  // Estados del generador de links
  const [linkMonto, setLinkMonto] = useState('');
  const [linkConcepto, setLinkConcepto] = useState('');
  const [linkGenerado, setLinkGenerado] = useState('');
  const [generandoLink, setGenerandoLink] = useState(false);

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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos/${comercioId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTransacciones(data); 
          
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
        setTimeout(() => setCargando(false), 500); // Pequeño delay para ver el Skeleton
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
          'x-api-key': localStorage.getItem('apiKey') // Añadido para la seguridad del backend
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
      console.error(error);
      toast.error('Error de red');
    } finally {
      setGenerandoLink(false);
    }
  };

  const copiarAlPortapapeles = (texto) => {
    navigator.clipboard.writeText(texto);
    toast.success('¡Copiado!');
  };

  // ---> 2. USO DEL SKELETON <---
  if (cargando) return <DashboardSkeleton />;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <Toaster position="top-right" />
      
      {/* Saludo */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">¡Hola, {nombreComercio}! 👋</h1>
          <p className="text-slate-500">Aquí tienes un resumen de tu negocio el día de hoy.</p>
        </div>
        <button onClick={() => navigate('/transacciones')} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm hidden sm:block">
          Ver reporte completo
        </button>
      </div>

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

      {/* ---> TU GENERADOR DE LINKS INTACTO <--- */}
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
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon size={16} className="text-slate-400" />
                <p className="text-sm font-bold text-slate-700">Link directo (WhatsApp, Instagram, etc.)</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" readOnly value={linkGenerado} className="flex-1 text-sm bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none text-blue-600 font-medium" />
                <button onClick={() => copiarAlPortapapeles(linkGenerado)} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors whitespace-nowrap">Copiar Link</button>
              </div>
            </div>

            <div className="bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Code size={16} className="text-slate-400" />
                <p className="text-sm font-bold text-slate-700">Botón HTML (Para páginas web)</p>
              </div>
              <div className="relative">
                <textarea 
                  readOnly 
                  value={`<a href="${linkGenerado}" target="_blank" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-family: sans-serif; display: inline-block;">Pagar $${linkMonto} con Lumina</a>`} 
                  className="w-full h-24 text-xs bg-slate-900 text-emerald-400 font-mono p-4 rounded-lg outline-none resize-none leading-relaxed" 
                />
                <button onClick={() => copiarAlPortapapeles(`<a href="${linkGenerado}" target="_blank" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-family: sans-serif; display: inline-block;">Pagar $${linkMonto} con Lumina</a>`)} className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors backdrop-blur-sm">Copiar Código</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---> 3. NUEVA TABLA DE TRANSACCIONES INTEGRADAS <--- */}
      <h3 className="text-lg font-bold text-slate-800 mb-4">Actividad Reciente</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <TransactionsTable 
          transacciones={transacciones.slice(0, 5)} // Solo mostramos 5 aquí
          setTransacciones={setTransacciones} 
        />
      </div>

    </div>
  );
}