import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // 1. Importamos los Toasts

export default function Checkout() {
  const [metodoPago, setMetodoPago] = useState('pago_movil');
  const [isProcessing, setIsProcessing] = useState(false); // Estado para bloquear el botón mientras "carga"
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    
    // Bloqueamos el botón para que el usuario no le dé doble clic
    setIsProcessing(true);

    // Lanzamos un Toast de "Cargando"
    const toastId = toast.loading('Conectando con el banco y procesando pago...');

    // Simulamos que el backend tarda 2.5 segundos en responder
    setTimeout(() => {
      // Cambiamos el Toast de "Cargando" a "Éxito"
      toast.success('¡Pago procesado exitosamente!', { id: toastId });
      
      // Desbloqueamos el botón
      setIsProcessing(false);

      // (Opcional) Limpiar formulario o regresar al inicio después del pago
      // navigate('/dashboard'); 
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      <div className="max-w-4xl w-full mx-auto mb-4 px-4 sm:px-0">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-sm font-medium text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-colors"
        >
          ← Volver al Panel de Control (Demo)
        </button>
      </div>

      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Columna Izquierda: Resumen de la compra */}
        <div className="md:w-1/3 bg-gray-900 text-white p-8 flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Estás pagando en</p>
            <h2 className="text-2xl font-bold mb-6">Zahara Store</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-300">Franela Oversize (Negra)</span>
                <span>$ 15.00</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-300">Envío Nacional</span>
                <span>$ 5.00</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-300">Total a pagar</span>
              <span className="text-2xl font-bold">$ 20.00</span>
            </div>
            <p className="text-right text-xs text-gray-400">Aprox. Bs. 720,00</p>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Pago */}
        <div className="md:w-2/3 p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Selecciona tu método de pago</h3>
          
          <div className="flex space-x-4 mb-8">
            <button 
              type="button"
              onClick={() => setMetodoPago('pago_movil')}
              className={`flex-1 py-3 border-2 rounded-xl font-medium transition-all ${metodoPago === 'pago_movil' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
            >
              Pago Móvil
            </button>
            <button 
              type="button"
              onClick={() => setMetodoPago('tarjeta')}
              className={`flex-1 py-3 border-2 rounded-xl font-medium transition-all ${metodoPago === 'tarjeta' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
            >
              Tarjeta
            </button>
          </div>

          <form className="space-y-5" onSubmit={handlePayment}>
            
            {metodoPago === 'pago_movil' ? (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 text-sm text-gray-600">
                  <p>Realiza el pago a los siguientes datos:</p>
                  <p className="font-mono mt-1 text-gray-800">Banco: <strong>0102 (BDV)</strong></p>
                  <p className="font-mono text-gray-800">Cédula: <strong>V-12345678</strong></p>
                  <p className="font-mono text-gray-800">Teléfono: <strong>0412-0000000</strong></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banco de Origen</label>
                  <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option value="">Selecciona un banco...</option>
                    <option>Banco de Venezuela (0102)</option>
                    <option>Banesco (0134)</option>
                    <option>Mercantil (0105)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Origen</label>
                    <input required type="text" placeholder="0412..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° de Referencia (Últimos 6)</label>
                    <input required type="text" placeholder="Ej. 847261" maxLength="6" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                  <input required type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Expiración</label>
                    <input required type="text" placeholder="MM/AA" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código de Seguridad (CVV)</label>
                    <input required type="text" placeholder="123" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                  <input required type="text" placeholder="Alejandro Navas" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full mt-6 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 shadow-gray-900/20'}`}
            >
              {isProcessing ? 'Procesando...' : 'Confirmar y Pagar'}
            </button>

            <div className="text-center mt-4 flex items-center justify-center text-xs text-gray-400 font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Pagos procesados de forma segura por ZaharaPay
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}