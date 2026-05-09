import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Zap, Globe, 
  Smartphone, Wallet, CheckCircle2 
} from 'lucide-react';
import LogoLumina from '../../components/ui/LogoLumina';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      
      {/* NAVEGACIÓN SUPERIOR (Optimizada para móvil) */}
      <nav className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Hacemos el logo un poco más pequeño en móvil si es posible (depende de tu componente) */}
          <div className="scale-90 sm:scale-100 origin-left">
            <LogoLumina />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold py-2 px-4 sm:py-2.5 sm:px-5 rounded-xl transition-all shadow-md whitespace-nowrap">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </nav>

      {/* SECCIÓN PRINCIPAL (HERO) */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-transparent blur-3xl rounded-full mix-blend-multiply"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-6 sm:mb-8">
            <Zap size={14} className="fill-blue-600" />
            La revolución de los cobros
          </div>
          
          {/* Texto dinámico: text-4xl en móvil, 5xl en tablet, 7xl en PC */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-5 sm:mb-6 leading-tight">
            Cobra en bolívares, <br className="hidden md:block" />
            recibe en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">cualquier moneda.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-500 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium px-2 sm:px-0">
            Lumina Pay unifica Pago Móvil, Zelle, PayPal y USDT en un solo link de cobro. Olvídate de perseguir capturas de pantalla y automatiza tu negocio.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
            <Link to="/registro" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 px-8 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-base sm:text-lg">
              Comenzar Gratis <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 sm:py-4 px-8 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 text-base sm:text-lg">
              Ver Demo
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE BENEFICIOS */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-200 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 sm:mb-4">Todo en una sola plataforma</h2>
            <p className="text-sm sm:text-base text-slate-500">Herramientas diseñadas para tiendas físicas, e-commerce y freelancers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                <Smartphone size={24} className="sm:w-[28px] sm:h-[28px]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Notificaciones Inteligentes</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Tus clientes reportan sus pagos por Pago Móvil y recibes una alerta automática directamente en tu WhatsApp.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                <Globe size={24} className="sm:w-[28px] sm:h-[28px]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Múltiples Pasarelas</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Acepta Zelle, Zinli, Web3 y automatiza cobros internacionales con PayPal. Un solo panel de control.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} className="sm:w-[28px] sm:h-[28px]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Seguridad Bancaria</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Tokens encriptados para proteger tus finanzas. Exporta reportes a Excel para tu contabilidad al instante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CALL TO ACTION (CTA) */}
      <section className="py-16 sm:py-24 relative overflow-hidden px-4">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 sm:mb-6">¿Listo para escalar tus cobros?</h2>
          <p className="text-base sm:text-lg text-slate-500 mb-8 sm:mb-10 px-2 sm:px-0">
            Únete a los comercios que ya están vendiendo más con Lumina Pay. Configuración en 2 minutos.
          </p>
          <Link to="/registro" className="w-full sm:w-auto flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-slate-900/20 gap-2 text-base sm:text-lg">
            Crear mi cuenta ahora <ArrowRight size={20} />
          </Link>
          
          {/* Apilamos los checks en móvil, los ponemos lado a lado en PC */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> Sin contratos ocultos</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> Plan gratuito disponible</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-center px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-4 opacity-50 grayscale scale-75 sm:scale-100">
            <LogoLumina />
          </div>
          <p className="text-xs sm:text-sm font-medium">© {new Date().getFullYear()} Lumina Pay. Desarrollado en Venezuela.</p>
        </div>
      </footer>
      
    </div>
  );
}