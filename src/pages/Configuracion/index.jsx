import React, { useState, useEffect } from 'react';
import { Save, Smartphone, CreditCard, Mail, Wallet, Loader2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Configuracion() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  // Estado inicial de la configuración
  const [config, setConfig] = useState({
    pago_movil_banco: '',
    pago_movil_cedula: '',
    pago_movil_tel: '',
    zelle_email: '',
    zinli_email: '',
    paypal_client_id: '',
    wallet_usdt: ''
  });

  // 1. Cargar la configuración actual desde el backend
  useEffect(() => {
    const cargarDatos = async () => {
      const comercioId = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token');

      if (!comercioId || !token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${comercioId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          // Llenamos el estado con los datos que vengan de la BD (si son null, ponemos string vacío)
          setConfig({
            pago_movil_banco: data.pago_movil_banco || '',
            pago_movil_cedula: data.pago_movil_cedula || '',
            pago_movil_tel: data.pago_movil_tel || '',
            zelle_email: data.zelle_email || '',
            zinli_email: data.zinli_email || '',
            paypal_client_id: data.paypal_client_id || '',
            wallet_usdt: data.wallet_usdt || ''
          });
        }
      } catch (error) {
        toast.error('Error al cargar la configuración');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  // 2. Guardar los cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    
    const comercioId = localStorage.getItem('comercioId');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${comercioId}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Enviamos todo el objeto config al backend
        body: JSON.stringify(config)
      });

      if (res.ok) {
        toast.success('¡Métodos de pago actualizados!');
      } else {
        toast.error('Error al guardar la configuración');
      }
    } catch (error) {
      toast.error('Error de red al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Métodos de Pago</h1>
        <p className="text-slate-500 mt-1">Configura las cuentas donde recibirás el dinero de tus clientes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* PAGO MÓVIL Y WHATSAPP */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Smartphone className="text-green-600" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Pago Móvil (Bolívares)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Banco</label>
              <input 
                type="text" name="pago_movil_banco" value={config.pago_movil_banco} onChange={handleChange}
                placeholder="Ej: Banesco, Mercantil..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cédula / RIF</label>
              <input 
                type="text" name="pago_movil_cedula" value={config.pago_movil_cedula} onChange={handleChange}
                placeholder="Ej: V-12345678"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm"
              />
            </div>
            <div>
              {/* 💡 AQUÍ LE DECIMOS AL USUARIO QUE ESTE NÚMERO TAMBIÉN ES PARA WHATSAPP */}
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                Teléfono <MessageCircle size={12} className="text-[#25D366]"/> (Pago Móvil y Notificaciones)
              </label>
              <input 
                type="text" name="pago_movil_tel" value={config.pago_movil_tel} onChange={handleChange}
                placeholder="Ej: 04141234567"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm"
              />
              <p className="text-[10px] text-slate-400 mt-1">A este número los clientes enviarán el reporte por WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* ZELLE Y ZINLI */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="text-purple-600" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Transferencias Directas (USD)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Zelle</label>
              <input 
                type="email" name="zelle_email" value={config.zelle_email} onChange={handleChange}
                placeholder="tu@correo.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Zinli</label>
              <input 
                type="email" name="zinli_email" value={config.zinli_email} onChange={handleChange}
                placeholder="tu@correo.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* CRIPTO WEB3 */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="text-amber-500" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Criptomonedas (Web3)</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Wallet USDT (Red BSC - BEP20)</label>
            <input 
              type="text" name="wallet_usdt" value={config.wallet_usdt} onChange={handleChange}
              placeholder="0x..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm font-mono"
            />
          </div>
        </div>

        {/* PAYPAL */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="text-blue-600" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Pasarelas Internacionales</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">PayPal Client ID</label>
            <input 
              type="text" name="paypal_client_id" value={config.paypal_client_id} onChange={handleChange}
              placeholder="Pega aquí tu Client ID de la consola de desarrollador de PayPal"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">Requerido para activar el botón de pago automático con PayPal.</p>
          </div>
        </div>

        {/* BOTÓN DE GUARDAR */}
        <div className="flex justify-end sticky bottom-6">
          <button 
            type="submit" 
            disabled={guardando}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2 disabled:opacity-70"
          >
            {guardando ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {guardando ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>

      </form>
    </div>
  );
}