import React, { useState, useEffect } from 'react';
import { Save, Wallet, Smartphone, Mail, Send, Loader2, SendHorizontal, Landmark, CreditCard, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Configuracion() {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [config, setConfig] = useState({
    wallet_usdt: '',
    pago_movil_cedula: '',
    pago_movil_banco: '',
    pago_movil_tel: '',
    zelle_email: '',
    zinli_email: '',
    paypal_client_id: '',
    telegram_chat_id: ''
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const id = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (error) {
        console.error("Error al cargar configuración:", error);
        toast.error("Error al cargar configuración");
      } finally {
        setCargando(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    const id = localStorage.getItem('comercioId');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${id}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });

      if (res.ok) {
        toast.success("¡Configuración guardada! 🚀");
      } else {
        toast.error("Error al guardar");
      }
    } catch (error) {
      console.error("Error de red:", error);
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="p-10 text-center text-slate-500 animate-pulse font-bold">Cargando tus ajustes...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-32">
      <Toaster position="top-right" />
      
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Ajustes de Cobro</h1>
        <p className="text-slate-500 font-medium">Configura dónde quieres recibir el dinero de tus ventas.</p>
      </div>

      <form onSubmit={handleGuardar} className="space-y-8">
        
        {/* SECCIÓN TELEGRAM */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <Send size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Notificaciones</h2>
              <p className="text-sm text-slate-500">Recibe alertas en tiempo real en tu celular.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex-1">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tu ID de Telegram</label>
              <input 
                type="text" name="telegram_chat_id" value={config.telegram_chat_id || ''} onChange={handleChange}
                placeholder="Ej: 582910392"
                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div className="text-xs text-slate-500 max-w-xs">
              <p className="font-bold text-blue-600 flex items-center gap-1 mb-1"><Info size={14}/> ¿Cómo obtenerlo?</p>
              Escribe <b>/id</b> al bot <span className="font-bold">@userinfobot</span> en Telegram y pega el número aquí.
            </div>
          </div>
        </div>

        {/* MÉTODOS DE PAGO VISUALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* PAGO MÓVIL */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-green-200 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Smartphone size={20}/></div>
              <h3 className="font-bold text-slate-800">Pago Móvil</h3>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <input type="text" name="pago_movil_banco" placeholder="Nombre del Banco" value={config.pago_movil_banco || ''} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-green-100" />
                <Landmark className="absolute right-4 top-3 text-slate-300" size={18}/>
              </div>
              <input type="text" name="pago_movil_cedula" placeholder="Cédula o RIF" value={config.pago_movil_cedula || ''} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-green-100" />
              <input type="text" name="pago_movil_tel" placeholder="Número de Teléfono" value={config.pago_movil_tel || ''} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-green-100" />
            </div>
          </div>

          {/* PAYPAL */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><CreditCard size={20}/></div>
              <h3 className="font-bold text-slate-800">PayPal (Tarjetas)</h3>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">Client ID de tu App de PayPal Developer</p>
              <textarea name="paypal_client_id" placeholder="Pega aquí tu Client ID de PayPal" value={config.paypal_client_id || ''} onChange={handleChange} className="w-full h-24 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 font-mono resize-none" />
            </div>
          </div>

          {/* ZELLE & ZINLI */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 md:col-span-2">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">Billeteras Digitales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">Z</div>
                <input type="text" name="zelle_email" placeholder="Correo de Zelle" value={config.zelle_email || ''} onChange={handleChange} className="bg-transparent flex-1 outline-none text-sm font-medium" />
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">Zi</div>
                <input type="text" name="zinli_email" placeholder="Correo de Zinli" value={config.zinli_email || ''} onChange={handleChange} className="bg-transparent flex-1 outline-none text-sm font-medium" />
              </div>
            </div>
          </div>

          {/* CRIPTO */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl md:col-span-2 text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">Wallet USDT (Binance / Web3)</h3>
            <input type="text" name="wallet_usdt" placeholder="0x..." value={config.wallet_usdt || ''} onChange={handleChange} className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white/20 font-mono placeholder:text-slate-500" />
          </div>

        </div>

        <div className="fixed bottom-8 right-8">
          <button 
            type="submit" disabled={guardando}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl shadow-blue-500/40 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {guardando ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            {guardando ? 'Guardando...' : 'Guardar Todo'}
          </button>
        </div>

      </form>
    </div>
  );
}