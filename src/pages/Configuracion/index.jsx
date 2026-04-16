import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet, Save, ArrowLeft, Smartphone, DollarSign, CreditCard, Zap, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Configuracion() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [esPro, setEsPro] = useState(false);
  
  // Estados Generales
  const [webhook, setWebhook] = useState('');
  const [planActual, setPlanActual] = useState('starter');

  // Estados de Métodos de Pago
  const [wallet, setWallet] = useState('');
  const [pmCedula, setPmCedula] = useState('');
  const [pmBanco, setPmBanco] = useState('');
  const [pmTel, setPmTel] = useState('');
  const [zelleEmail, setZelleEmail] = useState('');
  const [zinliEmail, setZinliEmail] = useState('');
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${comercioId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          // Guardamos el webhook en silencio para no borrarlo al actualizar otros datos
          setWebhook(data.url_webhook || '');
          
          setWallet(data.wallet_usdt || '');
          setPmCedula(data.pago_movil_cedula || '');
          setPmBanco(data.pago_movil_banco || '');
          setPmTel(data.pago_movil_tel || '');
          setZelleEmail(data.zelle_email || '');
          setZinliEmail(data.zinli_email || '');
          setPaypalId(data.paypal_client_id || '');
          
          const plan = data.plan_actual || 'starter';
          setPlanActual(plan);
          setEsPro(plan === 'pro' || plan === 'elite'); 
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${comercioId}/config`, {
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
          zinli_email: zinliEmail,
          paypal_client_id: paypalId
        })
      });

      if (response.ok) {
        toast.success('¡Configuración de pagos guardada!');
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

  if (cargando) return <div className="min-h-screen flex justify-center items-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft size={20} /> Volver al Panel
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Métodos de Cobro</h1>
            <p className="text-slate-500">Administra las cuentas bancarias y billeteras donde recibirás tu dinero.</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-sm border border-blue-200">
            Plan Actual: <span className="uppercase">{planActual}</span>
          </div>
        </div>

        {/* ANUNCIO GLOBAL UPSELL (Solo se muestra si NO es Pro) */}
        {!esPro && (
          <div className="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-xl border border-slate-700">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={20} className="text-amber-400" />
                <h3 className="text-lg font-bold text-white">Desbloquea el poder de Lumina Pro</h3>
              </div>
              <p className="text-slate-300 text-sm max-w-lg">
                Acepta pagos en Binance, PayPal y automatiza tus entregas con Webhooks. Pasa al siguiente nivel hoy mismo.
              </p>
            </div>
            <Link to="/planes" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-blue-500/20">
              Mejorar Plan
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-6">
            
            {/* WEB3 / BINANCE (BLOQUEADO SI ES STARTER) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
              {!esPro && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 text-center max-w-[200px]">
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2"><Lock size={16} /></div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Función Premium</h4>
                    <Link to="/planes" className="text-blue-600 font-bold text-xs hover:underline">Mejorar plan</Link>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FCD535]/10 text-[#FCD535] rounded-lg"><Wallet size={24} className="text-yellow-600" /></div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    Binance / USDT {!esPro && <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded uppercase font-black">PRO</span>}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mb-4">Recibe pagos directo a tu billetera Web3 o Binance (Red BSC/TRC20).</p>
                <input type="text" placeholder="Ej: 0x1234abcd..." disabled={!esPro} value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 font-mono text-sm outline-none focus:border-blue-500 disabled:bg-slate-50" />
              </div>
            </div>

            {/* PAYPAL (BLOQUEADO SI ES STARTER) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
              {!esPro && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 text-center max-w-[200px]">
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2"><Lock size={16} /></div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Función Premium</h4>
                    <Link to="/planes" className="text-blue-600 font-bold text-xs hover:underline">Mejorar plan</Link>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CreditCard size={24} /></div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    PayPal {!esPro && <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded uppercase font-black">PRO</span>}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mb-4">Ingresa tu Client ID de PayPal Developer.</p>
                <input type="text" placeholder="Client ID" disabled={!esPro} value={paypalId} onChange={(e) => setPaypalId(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50" />
              </div>
            </div>

            {/* ZINLI (GRATIS) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><DollarSign size={24} /></div>
                <h2 className="text-lg font-bold text-slate-800">Zinli</h2>
              </div>
              <input type="email" placeholder="correo@zinli.com" value={zinliEmail} onChange={(e) => setZinliEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500" />
            </div>

          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-6">
            
            {/* PAGO MÓVIL (GRATIS) */}
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

            {/* ZELLE (GRATIS) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><DollarSign size={24} /></div>
                <h2 className="text-lg font-bold text-slate-800">Zelle</h2>
              </div>
              <input type="email" placeholder="correo@zelle.com" value={zelleEmail} onChange={(e) => setZelleEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-sm outline-none focus:border-blue-500" />
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