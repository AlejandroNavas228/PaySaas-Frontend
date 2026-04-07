import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Shield, Star, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Planes() {
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  const cambiarPlan = async (nuevoPlan) => {
    setProcesando(true);
    const toastId = toast.loading('Procesando tu suscripción...');
    const token = localStorage.getItem('token');
    const comercioId = localStorage.getItem('comercioId');

    try {
      const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/comercio/${comercioId}/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: nuevoPlan })
      });

      if (response.ok) {
        toast.success(`¡Bienvenido al plan ${nuevoPlan.toUpperCase()}!`, { id: toastId });
        setTimeout(() => navigate('/configuracion'), 2000);
      } else {
        toast.error('Hubo un problema al procesar.', { id: toastId });
      }
    } catch (error) {
        console.error(error);
      toast.error('Error de conexión.', { id: toastId });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 font-sans text-slate-200">
      <div className="max-w-6xl mx-auto">
        
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} /> Volver al Panel
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Escala tu negocio con <span className="text-blue-500">Lumina</span></h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Elige el plan perfecto para procesar tus pagos de forma automática, sin intermediarios y con total seguridad.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* PLAN STARTER */}
          <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-slate-500 transition-colors flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-2">Starter</h2>
            <p className="text-slate-400 mb-6 text-sm">Ideal para emprendedores que están probando su idea.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$0</span><span className="text-slate-400">/mes</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Check size={20} className="text-green-400" /> <span className="text-sm">Hasta 20 transacciones al mes</span></li>
              <li className="flex items-center gap-3"><Check size={20} className="text-green-400" /> <span className="text-sm">Pagos Web3 (Cripto directas)</span></li>
              <li className="flex items-center gap-3"><Check size={20} className="text-green-400" /> <span className="text-sm">Pago Móvil (Verificación manual)</span></li>
            </ul>
            <button 
              onClick={() => cambiarPlan('starter')} disabled={procesando}
              className="w-full py-3 rounded-xl font-bold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              Elegir Starter
            </button>
          </div>

          {/* PLAN PRO (RECOMENDADO) */}
          <div className="bg-gradient-to-b from-blue-900 to-slate-800 rounded-3xl p-8 border-2 border-blue-500 transform md:-translate-y-4 shadow-2xl shadow-blue-900/50 flex flex-col relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap size={14} /> Más Popular
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Pro</h2>
            <p className="text-slate-300 mb-6 text-sm">Para tiendas online establecidas que necesitan automatización.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$15</span><span className="text-slate-400">/mes</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Check size={20} className="text-blue-400" /> <span className="text-sm text-white font-medium">Transacciones Ilimitadas</span></li>
              <li className="flex items-center gap-3"><Check size={20} className="text-blue-400" /> <span className="text-sm">Integración con Binance Pay</span></li>
              <li className="flex items-center gap-3"><Check size={20} className="text-blue-400" /> <span className="text-sm">Gestión de cobros por Zelle</span></li>
              <li className="flex items-center gap-3"><Check size={20} className="text-blue-400" /> <span className="text-sm">Webhooks Automáticos</span></li>
            </ul>
            <button 
              onClick={() => cambiarPlan('pro')} disabled={procesando}
              className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg"
            >
              Comenzar con Pro
            </button>
          </div>

          {/* PLAN BUSINESS */}
          <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-slate-500 transition-colors flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-2">Business</h2>
            <p className="text-slate-400 mb-6 text-sm">La solución definitiva con todos los métodos de pago globales.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$30</span><span className="text-slate-400">/mes</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Check size={20} className="text-purple-400" /> <span className="text-sm text-white font-medium">Todo lo del plan Pro</span></li>
              <li className="flex items-center gap-3"><Check size={20} className="text-purple-400" /> <span className="text-sm">Integración PayPal Express</span></li>
              <li className="flex items-center gap-3"><Shield size={20} className="text-purple-400" /> <span className="text-sm">Tarjetas de Crédito / Débito (Próximamente)</span></li>
              <li className="flex items-center gap-3"><Star size={20} className="text-purple-400" /> <span className="text-sm">Soporte Técnico Prioritario VIP</span></li>
            </ul>
            <button 
              onClick={() => cambiarPlan('business')} disabled={procesando}
              className="w-full py-3 rounded-xl font-bold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              Elegir Business
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}