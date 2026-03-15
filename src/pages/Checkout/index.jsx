import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  CreditCard, 
  Smartphone, 
  Lock, 
  ShieldCheck, 
  ArrowLeft,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function Checkout() {
  const [metodoPago, setMetodoPago] = useState('pago_movil');
  const [isProcessing, setIsProcessing] = useState(false);
  const [referencia, setReferencia] = useState(''); 
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    const comercioId = localStorage.getItem('comercioId');

    if (!comercioId) {
      toast.error('Error: No se detectó una tienda activa.');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Procesando pago de forma segura...');

    try {
      const response = await fetch('https://lumina-backend-3pu1.onrender.com/api/pagos/procesar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comercioId: comercioId,
          monto: 20.00,
          moneda: 'USD',
          metodo: metodoPago,
          referencia: referencia
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'El pago fue rechazado por el banco.', { id: toastId });
        setIsProcessing(false);
        return;
      }

      toast.success('¡Pago procesado y aprobado exitosamente!', { id: toastId });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor bancario.', { id: toastId });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-blue-100">
      
      {/* Botón de Volver */}
      <div className="max-w-5xl w-full mx-auto mb-6 px-4 sm:px-0">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <div className="p-2 bg-white rounded-full shadow-sm border border-slate-200 group-hover:shadow-md transition-all">
            <ArrowLeft size={16} />
          </div>
          Volver al Panel (Demo)
        </button>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-5xl w-full mx-auto bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row border border-slate-100/80">
        
        {/* COLUMNA IZQUIERDA: Resumen Elegante (Dark Mode) */}
        <div className="md:w-[40%] bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Círculos decorativos de fondo */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold mb-3">
              <Building2 size={16} /> Estás pagando en
            </div>
            <h2 className="text-3xl font-extrabold mb-8 tracking-tight text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                {(localStorage.getItem('comercioNombre') || 'Z').charAt(0)}
              </div>
              {localStorage.getItem('comercioNombre') || 'Zahara Store'}
            </h2>
            
            <div className="space-y-5 text-sm">
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center">👕</div>
                  <span className="text-slate-300 font-medium">Franela Oversize (Negra)</span>
                </div>
                <span className="font-semibold text-white">$ 15.00</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center">📦</div>
                  <span className="text-slate-300 font-medium">Envío Nacional</span>
                </div>
                <span className="font-semibold text-white">$ 5.00</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-slate-700/50 relative z-10">
            <div className="flex justify-between items-end mb-1">
              <span className="text-slate-400 font-medium">Total a pagar</span>
              <span className="text-4xl font-extrabold text-white tracking-tight">$ 20.00</span>
            </div>
            <p className="text-right text-sm text-slate-400 font-medium mt-2">Aprox. Bs. 720,00</p>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario de Pago */}
        <div className="md:w-[60%] p-10 lg:p-12 bg-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Método de pago</h3>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <Lock size={12} /> Pago 100% Seguro
            </div>
          </div>
          
          {/* Selector de Método (Tabs modernas) */}
          <div className="flex space-x-3 mb-8 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
            <button 
              type="button"
              onClick={() => setMetodoPago('pago_movil')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${metodoPago === 'pago_movil' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}
            >
              <Smartphone size={18} className={metodoPago === 'pago_movil' ? 'text-blue-600' : 'text-slate-400'} />
              Pago Móvil
            </button>
            <button 
              type="button"
              onClick={() => setMetodoPago('tarjeta')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${metodoPago === 'tarjeta' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}
            >
              <CreditCard size={18} className={metodoPago === 'tarjeta' ? 'text-blue-600' : 'text-slate-400'} />
              Tarjeta
            </button>
          </div>

          <form className="space-y-6" onSubmit={handlePayment}>
            
            {metodoPago === 'pago_movil' ? (
              <div className="space-y-5 animate-fade-in">
                
                {/* Caja de instrucciones de pago móvil */}
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600" />
                    Datos para transferir
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600/70 text-xs font-semibold mb-0.5">Banco</p>
                      <p className="font-extrabold text-blue-900">0102 (BDV)</p>
                    </div>
                    <div>
                      <p className="text-blue-600/70 text-xs font-semibold mb-0.5">Cédula</p>
                      <p className="font-extrabold text-blue-900">V-12345678</p>
                    </div>
                    <div>
                      <p className="text-blue-600/70 text-xs font-semibold mb-0.5">Teléfono</p>
                      <p className="font-extrabold text-blue-900">0412-0000000</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Banco de Origen</label>
                    <select required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none">
                      <option value="">Selecciona tu banco...</option>
                      <option>Banco de Venezuela (0102)</option>
                      <option>Banesco (0134)</option>
                      <option>Mercantil (0105)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono Origen</label>
                      <input required type="text" placeholder="0412..." className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">N° Referencia</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Ej. 847261" 
                        maxLength="6"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Número de Tarjeta</label>
                  <div className="relative">
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none" />
                    <CreditCard size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Expiración</label>
                    <input required type="text" placeholder="MM/AA" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">CVV</label>
                    <input required type="text" placeholder="123" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Titular</label>
                  <input required type="text" placeholder="Como aparece en la tarjeta" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none" />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full mt-8 flex items-center justify-center gap-2 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg ${isProcessing ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-600/30'}`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Procesando...
                </span>
              ) : (
                <>
                  <Lock size={18} />
                  Pagar $20.00
                </>
              )}
            </button>

            <div className="text-center mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold">
              <ShieldCheck size={16} className="text-slate-400" />
              Tus datos están protegidos por encriptación de 256-bits.
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}