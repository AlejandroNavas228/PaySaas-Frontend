import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Webhook, Wallet, Save, Copy, CheckCircle2, ArrowLeft, Smartphone, DollarSign, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Configuracion() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  // Estados Generales
  const [apiKey, setApiKey] = useState('');
  const [webhook, setWebhook] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [planActual, setPlanActual] = useState('starter');

  // Estados de Métodos de Pago
  const [wallet, setWallet] = useState('');
  const [pmCedula, setPmCedula] = useState('');
  const [pmBanco, setPmBanco] = useState('');
  const [pmTel, setPmTel] = useState('');
  const [zelleEmail, setZelleEmail] = useState('');
  const [paypalId, setPaypalId] = useState('');

  // 1. Cargar datos al entrar
  useEffect(() => {
    const cargarConfiguracion = async () => {
      const token = localStorage.getItem('token');
      const comercioId = localStorage.getItem('comercioId');

      if (!token || !comercioId) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/comercio/${comercioId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setApiKey(data.api_key || '');
          setWebhook(data.url_webhook || '');
          setWallet(data.wallet_usdt || '');
          setPmCedula(data.pago_movil_cedula || '');
          setPmBanco(data.pago_movil_banco || '');
          setPmTel(data.pago_movil_tel || '');
          setZelleEmail(data.zelle_email || '');
          setPaypalId(data.paypal_client_id || '');
          setPlanActual(data.plan_actual || 'starter');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar tu configuración.');
      } finally {
        setCargando(false);
      }
    };
    cargarConfiguracion();
  }, [navigate]);

  // 2. Guardar cambios
  const guardarCambios = async () => {
    setGuardando(true);
    const token = localStorage.getItem('token');
    const comercioId = localStorage.getItem('comercioId');

    try {
      const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/comercio/${comercioId}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          url_webhook: webhook,
          wallet_usdt: wallet,
          pago_movil_cedula: pmCedula,
          pago_movil_banco: pmBanco,
          pago_movil_tel: pmTel,
          zelle_email: zelleEmail,
          paypal_client_id: paypalId
        })
      });

      if (response.ok) {
        toast.success('¡Configuración guardada!');
      } else {
        toast.error('Hubo un problema al guardar.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión.');
    } finally {
      setGuardando(false);
    }
  };

  const copiarApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiado(true);
    toast.success('Llave copiada');
    setTimeout(() => setCopiado(false), 2000);
  };

  if (cargando) return <div className="min-h-screen flex justify-center items-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft size={20} /> Volver al Panel
        </button>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Configuración</h1>
            <p className="text-slate-500">Administra tus métodos de cobro y credenciales.</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-sm border border-blue-200">
            Plan Actual: <span className="uppercase">{planActual}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* COLUMNA IZQUIERDA: Cripto y Desarrolladores */}
          <div className="space-y-6">
            
            {/* WEB3 / USDT */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FCD535]/10 text-[#FCD535] rounded-lg"><Wallet size={24} className="text-yellow-600" /></div>
                <h2 className="text-lg font-bold text-slate-800">Cripto (USDT)</h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">Recibe pagos directo a tu billetera Web3 (Red BSC).</p>
              <input type="text" placeholder="Ej: 0x1234abcd..." value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 font-mono text-sm outline-none focus:border-blue-500" />
            </div>

            {/* ZELLE */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><DollarSign size={24} /></div>
                <h2 className="text-lg font-bold text-slate-800">Zelle</h2>
              </div>
              <input type="email" placeholder="correo@zelle.com" value={zelleEmail} onChange={(e) => setZelleEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500" />
            </div>

            {/* PAYPAL */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CreditCard size={24} /></div>
                <h2 className="text-lg font-bold text-slate-800">PayPal</h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">Ingresa tu Client ID de PayPal Developer.</p>
              <input type="text" placeholder="Client ID" value={paypalId} onChange={(e) => setPaypalId(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500" />
            </div>

          </div>

          {/* COLUMNA DERECHA: Nacional y Sistema */}
          <div className="space-y-6">
            
            {/* PAGO MÓVIL */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Smartphone size={24} /></div>
                <h2 className="text-lg font-bold text-slate-800">Pago Móvil</h2>
              </div>
              <div className="space-y-3">
                <input type="text" placeholder="Cédula / RIF (Ej: V12345678)" value={pmCedula} onChange={(e) => setPmCedula(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500" />
                <input type="text" placeholder="Banco (Ej: Banesco, Venezuela)" value={pmBanco} onChange={(e) => setPmBanco(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500" />
                <input type="tel" placeholder="Teléfono (Ej: 04141234567)" value={pmTel} onChange={(e) => setPmTel(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>

            {/* API KEY */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Key size={24} /></div>
                <h2 className="text-lg font-bold text-slate-800">API Key</h2>
              </div>
              <div className="flex gap-2">
                <input type="password" value={apiKey} readOnly className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-slate-700 font-mono text-sm focus:ring-0" />
                <button onClick={copiarApiKey} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl transition-colors">
                  {copiado ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* WEBHOOK */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Webhook size={24} /></div>
                <h2 className="text-lg font-bold text-slate-800">Webhook URL</h2>
              </div>
              <input type="url" placeholder="https://tutienda.com/api/webhook" value={webhook} onChange={(e) => setWebhook(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500" />
            </div>

          </div>

        </div>

        {/* BOTÓN GUARDAR (FLOTANTE AL FINAL) */}
        <div className="flex justify-end pb-10">
          <button 
            onClick={guardarCambios}
            disabled={guardando}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all ${guardando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
          >
            <Save size={20} />
            {guardando ? 'Guardando...' : 'Guardar Todo'}
          </button>
        </div>

      </div>
    </div>
  );
}