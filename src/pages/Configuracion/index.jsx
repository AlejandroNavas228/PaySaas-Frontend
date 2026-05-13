import React, { useState, useEffect } from 'react';
import { Save, Smartphone, DollarSign, Wallet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingScreen from '../../components/ui/LoadingScreen';

// 💡 IMPORTAMOS EL SERVICIO
import { api } from '../../services/api';

export default function Configuracion() {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  const [config, setConfig] = useState({
    pago_movil_cedula: '',
    pago_movil_banco: '',
    pago_movil_tel: '',
    zelle_email: '',
    zinli_email: '',
    paypal_client_id: '',
    wallet_usdt: ''
  });

  useEffect(() => {
    const cargarConfiguracion = async () => {
      const comercioId = localStorage.getItem('comercioId');
      if (!comercioId) return;

      try {
        // 💡 LLAMADA LIMPIA
        const data = await api.obtenerComercio(comercioId);
        setConfig({
          pago_movil_cedula: data.pago_movil_cedula || '',
          pago_movil_banco: data.pago_movil_banco || '',
          pago_movil_tel: data.pago_movil_tel || '',
          zelle_email: data.zelle_email || '',
          zinli_email: data.zinli_email || '',
          paypal_client_id: data.paypal_client_id || '',
          wallet_usdt: data.wallet_usdt || ''
        });
      } catch (error) {
        toast.error(error.message || 'Error al cargar la configuración');
      } finally {
        setTimeout(() => setCargando(false), 500);
      }
    };
    cargarConfiguracion();
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const guardarConfiguracion = async () => {
    setGuardando(true);
    const comercioId = localStorage.getItem('comercioId');

    try {
      // 💡 GUARDADO LIMPIO
      await api.actualizarConfiguracion(comercioId, config);
      toast.success('¡Configuración guardada con éxito!');
    } catch (error) {
      toast.error(error.message || 'Error al guardar los datos');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <LoadingScreen />;

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-8">
      {/* ... (El resto del diseño HTML se mantiene igual de impecable) ... */}
      <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Métodos de Cobro</h1>
          <p className="text-slate-500 font-medium">Configura dónde recibirás el dinero de tus ventas.</p>
        </div>
        <button 
          onClick={guardarConfiguracion}
          disabled={guardando}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-70 w-full sm:w-auto justify-center"
        >
          {guardando ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {guardando ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* PAGO MÓVIL */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><Smartphone size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Pago Móvil (Venezuela)</h2>
              <p className="text-sm text-slate-500 font-medium">Datos para transferencias en bolívares.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cédula / RIF</label>
              <input type="text" name="pago_movil_cedula" value={config.pago_movil_cedula} onChange={handleChange} placeholder="V-12345678" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Banco</label>
              <input type="text" name="pago_movil_banco" value={config.pago_movil_banco} onChange={handleChange} placeholder="Ej: Mercantil" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Teléfono</label>
              <input type="text" name="pago_movil_tel" value={config.pago_movil_tel} onChange={handleChange} placeholder="0414-1234567" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700" />
            </div>
          </div>
        </div>

        {/* DÓLARES DIGITALES */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><DollarSign size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Dólares Digitales</h2>
              <p className="text-sm text-slate-500 font-medium">Correos asociados a tus billeteras.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Zelle</label>
              <input type="email" name="zelle_email" value={config.zelle_email} onChange={handleChange} placeholder="tu_zelle@email.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Zinli</label>
              <input type="email" name="zinli_email" value={config.zinli_email} onChange={handleChange} placeholder="tu_zinli@email.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700" />
            </div>
          </div>
        </div>

        {/* CRIPTO E INTERNACIONAL */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Wallet size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Internacional y Cripto</h2>
              <p className="text-sm text-slate-500 font-medium">Recibe pagos globales a través de PayPal o USDT.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Billetera USDT (TRC20)</label>
              <input type="text" name="wallet_usdt" value={config.wallet_usdt} onChange={handleChange} placeholder="TXXXXXXXXXXXXXXXXXXXXXXXXXXXX" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">PayPal Client ID</label>
              <input type="text" name="paypal_client_id" value={config.paypal_client_id} onChange={handleChange} placeholder="Client ID de PayPal Developer" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700 font-mono" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}