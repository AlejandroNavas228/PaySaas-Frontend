import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreditCard, CheckCircle2, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Checkout() {
  // 1. Leer los datos mágicos que vienen en la URL
  const [searchParams] = useSearchParams();
  const comercioId = searchParams.get('comercioId');
  const monto = searchParams.get('monto');
  const referencia = searchParams.get('referencia');

  const [cargando, setCargando] = useState(false);
  const [pagado, setPagado] = useState(false);

  // Si alguien entra al enlace sin datos (hackers o curiosos), los bloqueamos
  if (!comercioId || !monto) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Enlace Inválido</h2>
          <p className="text-slate-500">Faltan datos para procesar el pago. Por favor, regresa a la tienda e inténtalo de nuevo.</p>
        </div>
      </div>
    );
  }

  // 2. Función para disparar el pago a tu Backend
  const procesarPago = async () => {
    setCargando(true);
    try {
      const response = await fetch('https://lumina-backend-3pu1.onrender.com/api/pagos/enlace-publico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comercioId: comercioId,
          monto: parseFloat(monto),
          moneda: 'USD',
          metodo: 'Lumina Link',
          referencia: referencia
        })
      });

      if (response.ok) {
        setPagado(true);
      } else {
        toast.error('Error al procesar el pago');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con la bóveda');
    } finally {
      setCargando(false);
    }
  };

  // 3. Pantalla de Éxito
  if (pagado) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center animate-fade-in border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">¡Pago Exitoso!</h2>
          <p className="text-slate-500 mb-6">Tu pago de ${parseFloat(monto).toFixed(2)} ha sido procesado. La tienda ha sido notificada automáticamente.</p>
        </div>
      </div>
    );
  }

  // 4. Pantalla de Cobro
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        
        {/* Cabecera del Checkout */}
        <div className="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-400 font-medium text-sm mb-2 uppercase tracking-widest">Total a Pagar</p>
            <h1 className="text-5xl font-black text-white tracking-tight">${parseFloat(monto).toFixed(2)} <span className="text-xl text-slate-400 font-medium">USD</span></h1>
          </div>
        </div>

        {/* Detalles de la Orden */}
        <div className="px-8 py-8">
          <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-500 font-medium text-sm">Comercio</span>
              <span className="text-slate-800 font-bold flex items-center gap-2"><Building2 size={16}/> Tienda Verificada</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
              <span className="text-slate-500 font-medium text-sm">N° de Orden</span>
              <span className="text-slate-800 font-mono font-bold bg-slate-200 px-2 py-1 rounded">#{referencia || 'N/A'}</span>
            </div>
          </div>

          <button 
            onClick={procesarPago}
            disabled={cargando}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-transform active:scale-95 disabled:bg-blue-400 flex items-center justify-center gap-3 shadow-lg shadow-blue-600/30"
          >
            <CreditCard size={24} />
            {cargando ? 'Procesando seguro...' : `Pagar $${parseFloat(monto).toFixed(2)}`}
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
            <CheckCircle2 size={14} /> Pagos 100% seguros con Lumina Pay
          </p>
        </div>
      </div>
    </div>
  );
}