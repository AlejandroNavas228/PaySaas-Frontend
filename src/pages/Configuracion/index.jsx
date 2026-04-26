import React, { useState, useEffect } from 'react';
import { Save, Globe, Wallet, Smartphone, Mail, CreditCard, MessageSquare, Send, info, Loader2, SendHorizontal } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Configuracion() {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [config, setConfig] = useState({
    url_webhook: '',
    wallet_usdt: '',
    pago_movil_cedula: '',
    pago_movil_banco: '',
    pago_movil_tel: '',
    zelle_email: '',
    zinli_email: '',
    paypal_client_id: '',
    telegram_chat_id: '' // 📱 Nuevo campo
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
        toast.success("¡Configuración actualizada con éxito! 🚀");
      } else {
        toast.error("Error al guardar los cambios");
      }
    } catch (error) {
      console.error("Error al guardar configuración:", error);  
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="p-10 text-center text-slate-500 animate-pulse">Cargando tus ajustes...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Configuración</h1>
        <p className="text-slate-500">Gestiona tus métodos de pago y canales de notificación.</p>
      </div>

      <form onSubmit={handleGuardar} className="space-y-8">
        
        {/* 1. SECCIÓN DE NOTIFICACIONES (TELEGRAM) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Send size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Notificaciones Instantáneas</h2>
              <p className="text-sm text-slate-500">Recibe un aviso en tu celular cada vez que apruebes un pago.</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-blue-100 mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg mt-1">
                <MessageSquare size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 mb-2">¿Cómo conectar tu Telegram?</p>
                <ol className="text-xs text-slate-600 space-y-2 list-decimal ml-4 leading-relaxed">
                  <li>Busca en Telegram el bot: <span className="font-bold text-blue-600">@userinfobot</span> e inícialo.</li>
                  <li>Copia el número que te da (tu <b>Id</b>).</li>
                  <li>Pégalo en el recuadro de abajo y guarda los cambios.</li>
                  <li>¡Listo! Ahora busca tu bot de Lumina e inícialo para recibir los mensajes.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Tu Telegram Chat ID</label>
            <div className="relative group">
              <input 
                type="text" name="telegram_chat_id" value={config.telegram_chat_id || ''} onChange={handleChange}
                placeholder="Ej: 582910392"
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-mono"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                <SendHorizontal size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* 2. MÉTODOS DE PAGO (PAGO MÓVIL, ZELLE, ETC.) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Wallet className="text-slate-400" size={20} /> Métodos de Recepción
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pago Móvil */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Pago Móvil (Venezuela)</p>
              <input type="text" name="pago_movil_banco" placeholder="Banco" value={config.pago_movil_banco || ''} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
              <input type="text" name="pago_movil_cedula" placeholder="Cédula / RIF" value={config.pago_movil_cedula || ''} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
              <input type="text" name="pago_movil_tel" placeholder="Teléfono" value={config.pago_movil_tel || ''} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>

            {/* Zelle & Zinli */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Dólares Electrónicos</p>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1">
                <Mail size={16} className="text-slate-300" />
                <input type="text" name="zelle_email" placeholder="Correo Zelle" value={config.zelle_email || ''} onChange={handleChange} className="w-full py-1.5 text-sm outline-none bg-transparent" />
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1">
                <Mail size={16} className="text-slate-300" />
                <input type="text" name="zinli_email" placeholder="Correo Zinli" value={config.zinli_email || ''} onChange={handleChange} className="w-full py-1.5 text-sm outline-none bg-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. DESARROLLADORES Y WEBHOOKS */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Globe className="text-slate-400" size={20} /> Integración Técnica
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">URL del Webhook (Solo Plan Business)</label>
              <input type="text" name="url_webhook" placeholder="https://tutienda.com/api/webhook" value={config.url_webhook || ''} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Wallet USDT (Red BSC)</label>
              <input type="text" name="wallet_usdt" placeholder="0x..." value={config.wallet_usdt || ''} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 font-mono" />
            </div>
          </div>
        </div>

        {/* BOTÓN FLOTANTE DE GUARDAR */}
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            type="submit" disabled={guardando}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl shadow-blue-500/40 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {guardando ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </form>
    </div>
  );
}