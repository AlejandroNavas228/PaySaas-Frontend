import React, { useState, useEffect } from 'react';
import { CheckCircle2, Zap, Crown, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Planes() {
  const [cargandoPlan, setCargandoPlan] = useState(null);
  const [planActual, setPlanActual] = useState('starter');

  // Cargamos el plan actual del usuario al abrir la página
  useEffect(() => {
    const cargarPerfil = async () => {
      const id = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token');
      if (!id || !token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPlanActual(data.plan_actual);
        }
      } catch (error) { console.error(error); }
    };
    cargarPerfil();
  }, []);

  // Función que llama al Backend para generar el link
  const comprarPlan = async (nombrePlan) => {
    setCargandoPlan(nombrePlan);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suscripcion/generar`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: nombrePlan })
      });

      const data = await res.json();

      if (res.ok && data.url_pago) {
        toast.success("Redirigiendo a la pasarela segura...", { icon: '🔒' });
        // Redirigimos al usuario a su propio checkout de Lumina
        setTimeout(() => {
          window.location.href = data.url_pago;
        }, 1500);
      } else {
        toast.error(data.error || 'Error al procesar la solicitud');
        setCargandoPlan(null);
      }
    } catch (error) {
      toast.error('Error de conexión con el servidor');
      setCargandoPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Mejora tu cuenta de Lumina Pay</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Desbloquea el verdadero potencial de tu negocio. Elige el plan que mejor se adapte a tus ventas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* PLAN STARTER */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col relative">
          {planActual === 'starter' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full">
              PLAN ACTUAL
            </div>
          )}
          <h3 className="text-xl font-bold text-slate-800 mb-2">Starter</h3>
          <p className="text-slate-500 text-sm mb-6 h-10">Para emprendedores que están dando sus primeros pasos.</p>
          <div className="mb-6">
            <span className="text-4xl font-black text-slate-900">$0</span>
            <span className="text-slate-500">/mes</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-slate-400 shrink-0"/> Pasarela básica</li>
            <li className="flex items-start gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-slate-400 shrink-0"/> Link de pago manual</li>
            <li className="flex items-start gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-slate-400 shrink-0"/> Historial de 5 pagos</li>
          </ul>
          <button disabled className="w-full py-3 rounded-xl font-bold text-slate-500 bg-slate-100 border border-slate-200 cursor-not-allowed">
            {planActual === 'starter' ? 'Plan Activo' : 'Plan Básico'}
          </button>
        </div>

        {/* PLAN PRO (Destacado) */}
        <div className="bg-gradient-to-b from-blue-600 to-indigo-700 rounded-3xl p-8 border border-blue-500 shadow-xl shadow-blue-600/20 flex flex-col relative transform md:-translate-y-4">
          {planActual === 'pro' ? (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-900 text-xs font-black px-4 py-1.5 rounded-full shadow-md">
              ¡TU PLAN ACTUAL!
            </div>
          ) : (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-900 text-xs font-black px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <Zap size={14} /> MÁS POPULAR
            </div>
          )}
          
          <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
          <p className="text-blue-100 text-sm mb-6 h-10">Para tiendas y negocios con flujo constante de ventas.</p>
          <div className="mb-6 text-white">
            <span className="text-4xl font-black">$9.99</span>
            <span className="text-blue-200">/mes</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-blue-50"><CheckCircle2 size={18} className="text-amber-400 shrink-0"/> Todo lo del plan Starter</li>
            <li className="flex items-start gap-3 text-sm text-blue-50"><CheckCircle2 size={18} className="text-amber-400 shrink-0"/> URL de redirección (Éxito)</li>
            <li className="flex items-start gap-3 text-sm text-blue-50"><CheckCircle2 size={18} className="text-amber-400 shrink-0"/> Exportación a Excel / CSV</li>
            <li className="flex items-start gap-3 text-sm text-blue-50"><CheckCircle2 size={18} className="text-amber-400 shrink-0"/> Notificaciones a WhatsApp</li>
          </ul>
          
          {planActual === 'pro' || planActual === 'business' ? (
            <button disabled className="w-full py-3 rounded-xl font-bold text-white bg-white/20 cursor-not-allowed">
              Ya tienes estos beneficios
            </button>
          ) : (
            <button 
              onClick={() => comprarPlan('pro')}
              disabled={cargandoPlan !== null}
              className="w-full py-3 rounded-xl font-bold text-blue-700 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg flex justify-center items-center gap-2"
            >
              {cargandoPlan === 'pro' ? <Loader2 className="animate-spin" size={20} /> : 'Mejorar a Pro'}
            </button>
          )}
        </div>

        {/* PLAN BUSINESS */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col relative">
          {planActual === 'business' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Crown size={14} /> PLAN ÉLITE ACTIVO
            </div>
          )}
          <h3 className="text-xl font-bold text-white mb-2">Business</h3>
          <p className="text-slate-400 text-sm mb-6 h-10">Para empresas, e-commerce grandes y desarrolladores.</p>
          <div className="mb-6 text-white">
            <span className="text-4xl font-black">$29.99</span>
            <span className="text-slate-500">/mes</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="text-purple-500 shrink-0"/> Todo lo del plan Pro</li>
            <li className="flex items-start gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="text-purple-500 shrink-0"/> <strong>API Key Privada</strong></li>
            <li className="flex items-start gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="text-purple-500 shrink-0"/> Webhooks para E-commerce</li>
            <li className="flex items-start gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="text-purple-500 shrink-0"/> Soporte técnico VIP 24/7</li>
          </ul>

          {planActual === 'business' ? (
            <button disabled className="w-full py-3 rounded-xl font-bold text-white bg-slate-800 cursor-not-allowed">
              Máximo nivel alcanzado
            </button>
          ) : (
            <button 
              onClick={() => comprarPlan('business')}
              disabled={cargandoPlan !== null}
              className="w-full py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20 flex justify-center items-center gap-2"
            >
              {cargandoPlan === 'business' ? <Loader2 className="animate-spin" size={20} /> : 'Obtener Business'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}