import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200">
      
      {/* Barra de Navegación Pública */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Lumi<span className="text-blue-600">na</span> 
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => navigate('/registro')}
            className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Crear cuenta gratis
          </button>
        </div>
      </nav>

      {/* Sección Principal (Hero) */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          La nueva era de los pagos
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
          Cobra a tus clientes de forma <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">rápida y segura.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          La pasarela de pagos definitiva para tu negocio. Acepta transferencias, pago móvil y tarjetas en una sola plataforma, con reportes en tiempo real.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/registro')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-1"
          >
            Empezar ahora <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-all"
          >
            Ver demo en vivo
          </button>
        </div>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Integración en minutos</h3>
            <p className="text-slate-500">Conecta tu tienda rápidamente y empieza a recibir pagos el mismo día. Sin papeleos interminables.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Seguridad Bancaria</h3>
            <p className="text-slate-500">Tus datos y los de tus clientes están protegidos con encriptación de grado militar y tokens JWT.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Multimoneda</h3>
            <p className="text-slate-500">Procesa pagos en Bolívares y Dólares con cálculo de tasas en tiempo real. Unifica tu contabilidad.</p>
          </div>
        </div>
      </main>
    </div>
  );
}