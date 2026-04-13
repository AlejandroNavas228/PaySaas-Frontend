import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, ShieldCheck, CreditCard, Loader2, CheckCircle2, QrCode, Wallet, Copy, Smartphone, DollarSign, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout() {
  const { id } = useParams();
  const [transaccion, setTransaccion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesandoPago, setProcesandoPago] = useState(false);
  
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [pagoEnRevision, setPagoEnRevision] = useState(false);
  const [modoWeb3, setModoWeb3] = useState(false);
  const [modoManual, setModoManual] = useState(null); 
  const [referenciaManual, setReferenciaManual] = useState('');
  const [datosWeb3, setDatosWeb3] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const [modoPayPal, setModoPayPal] = useState(false);
  const [modoBinance, setModoBinance] = useState(false); // NUEVO ESTADO PARA BINANCE QR

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTransaccion(data);
        } else {
          toast.error('Enlace de pago inválido o expirado.');
        }
      } catch (error) {
         console.error(error);
        toast.error('Error de conexión con el servidor.');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id]);

  const copiarTexto = (texto, mensaje = 'Copiado') => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    toast.success(mensaje);
    setTimeout(() => setCopiado(false), 2000);
  };

  const procesarPagoPayPal = async (orderId) => {
    setProcesandoPago(true);
    const toastId = toast.loading('Verificando tarjeta con el banco...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/${id}/pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metodo: 'paypal', referencia: orderId })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('¡Pago Internacional Aprobado!', { id: toastId });
        setPagoExitoso(true);
        if (transaccion?.urlExito) setTimeout(() => { window.location.href = transaccion.urlExito; }, 3000);
      } else {
        toast.error(data.error || 'Error verificando en Lumina.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de red.', { id: toastId });
    } finally {
      setProcesandoPago(false);
    }
  };

  const iniciarPagoWeb3 = async () => {
    setProcesandoPago(true);
    const toastId = toast.loading('Generando bóveda segura...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/${id}/crypto-info`);
      const data = await response.json();
      if (response.ok) {
        toast.dismiss(toastId);
        setDatosWeb3(data);
        setModoWeb3(true);
      } else { toast.error(data.error || 'La tienda no acepta Web3 aún.', { id: toastId }); }
    } catch (err) { console.error(err); toast.error('Error de red.', { id: toastId }); } 
    finally { setProcesandoPago(false); }
  };

  const verificarPagoWeb3 = async () => {
    const toastId = toast.loading('📡 Escaneando Blockchain...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/${id}/verificar-crypto`, { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.mensaje, { id: toastId });
        setPagoExitoso(true);
        if (transaccion?.urlExito) setTimeout(() => { window.location.href = transaccion.urlExito; }, 3000);
      } else { toast.error(data.error || 'Aún no vemos el pago.', { id: toastId }); }
    } catch (err) { console.error(err); toast.error('Error contactando al radar.', { id: toastId }); }
  };

  const enviarReporteManual = async (metodoReemplazo = null) => {
    if (!referenciaManual.trim()) return toast.error('Debes ingresar el número de referencia.');
    setProcesandoPago(true);
    const toastId = toast.loading('Enviando reporte a la tienda...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/${id}/reportar-manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metodo: metodoReemplazo || modoManual, referencia: referenciaManual })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('¡Reporte enviado!', { id: toastId });
        setPagoEnRevision(true);
      } else { toast.error(data.error || 'Error al reportar.', { id: toastId }); }
    } catch (err) { console.error(err); toast.error('Error de red.', { id: toastId }); } 
    finally { setProcesandoPago(false); }
  };

  if (cargando) return <div className="min-h-screen flex justify-center items-center bg-slate-900"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (!transaccion && !cargando) return <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white">Enlace Inválido</div>;

  const { metodosDisponibles, comercio } = transaccion;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <Toaster position="top-center" />
      
      <div className="text-center mb-8 z-10">
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          Lumi<span className="text-blue-500">na</span> Checkout <ShieldCheck className="text-green-400" size={24} />
        </h1>
        <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">Entorno Seguro de Pagos</p>
      </div>

      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl z-10">
        
        {pagoExitoso ? (
          <div className="p-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="text-green-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Pago Exitoso!</h2>
            <p className="text-slate-500 mb-8">La transacción ha sido verificada correctamente.</p>
          </div>
        ) : 

        pagoEnRevision ? (
          <div className="p-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="text-orange-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">En Revisión</h2>
            <p className="text-slate-500 mb-8">La tienda verificará tu número de referencia ({referenciaManual}) y procesará tu pedido pronto.</p>
            {transaccion.urlExito && (
              <button onClick={() => window.location.href = transaccion.urlExito} className="text-blue-600 font-bold hover:underline">Volver a la tienda</button>
            )}
          </div>
        ) : 

        modoWeb3 ? (
          <div className="p-8 animate-in slide-in-from-right duration-300">
            <button onClick={() => setModoWeb3(false)} className="text-sm text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1">← Volver</button>
            <div className="text-center mb-6">
              <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Envía exactamente</p>
              <h2 className="text-4xl font-bold text-slate-800">{datosWeb3.monto} <span className="text-xl text-slate-400">USDT</span></h2>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center border border-slate-100 mb-6">
              <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
                <QRCodeSVG value={datosWeb3.wallet} size={180} level="H" />
              </div>
              <div className="w-full relative">
                <p className="text-xs font-bold text-slate-400 mb-1 uppercase text-center">Billetera de Destino (Red BSC)</p>
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <input type="text" readOnly value={datosWeb3.wallet} className="w-full text-xs text-slate-500 px-3 py-2 outline-none font-mono" />
                  <button onClick={() => copiarTexto(datosWeb3.wallet, 'Billetera Copiada')} className="bg-slate-100 hover:bg-slate-200 px-3 py-2 transition-colors border-l border-slate-200">
                    <Copy size={16} className="text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
            <button onClick={verificarPagoWeb3} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-md">
              <ShieldCheck size={20} /> Ya pagué, verificar transacción
            </button>
          </div>
        ) : 

        modoPayPal ? (
          <div className="p-8 animate-in slide-in-from-right duration-300">
            <button onClick={() => setModoPayPal(false)} className="text-sm text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1">← Volver</button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <CreditCard size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Pago Internacional</h2>
              <p className="text-sm text-slate-500 mt-2">Paga seguro con tu Tarjeta de Crédito, Débito o saldo PayPal.</p>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 relative z-0">
              {procesandoPago && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              )}
              
              <PayPalScriptProvider options={{ "client-id": comercio.paypal_client_id, currency: "USD", intent: "capture" }}>
                <PayPalButtons 
                  style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{
                        amount: { value: transaccion.monto.toString() },
                        description: transaccion.descripcion
                      }]
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                      procesarPagoPayPal(details.id);
                    });
                  }}
                  onError={(err) => {
                    toast.error("Error conectando con el banco.");
                    console.error("PayPal Error:", err);
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        ) : 

        /* NUEVA PANTALLA: BINANCE QR DIRECTO */
        modoBinance ? (
          <div className="p-8 animate-in slide-in-from-right duration-300 bg-slate-900 rounded-3xl h-full">
            <button onClick={() => setModoBinance(false)} className="text-sm text-slate-400 hover:text-white mb-4 flex items-center gap-1">← Volver</button>
            
            <div className="text-center relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Paga con USDT</h3>
              <p className="text-slate-400 text-sm mb-6">Escanea el código QR desde tu app de Binance o envía a la dirección.</p>
              
              <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-xl shadow-yellow-500/10 border-4 border-slate-700">
                <QRCodeSVG 
                  value={comercio?.wallet_usdt || 'Error: Billetera no configurada'} 
                  size={180} 
                  level={"H"}
                  fgColor="#0F172A" 
                />
              </div>

              <div className="bg-slate-800 p-4 rounded-xl mb-6 text-left">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Dirección (Red TRC20 / BSC)</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={comercio?.wallet_usdt || ''} 
                    className="flex-1 bg-transparent text-yellow-400 text-sm font-mono outline-none truncate" 
                  />
                  <button 
                    onClick={() => copiarTexto(comercio?.wallet_usdt, 'Dirección Copiada')} 
                    className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="text-left mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">ID de Transacción (TXID)</label>
                <input 
                  type="text" 
                  placeholder="Ej: 8a7b6c5d4e..." 
                  value={referenciaManual}
                  onChange={(e) => setReferenciaManual(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-mono text-sm"
                />
              </div>

              <button 
                onClick={() => enviarReporteManual('Binance USDT')} 
                disabled={procesandoPago || !referenciaManual}
                className="w-full bg-[#FCD535] hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {procesandoPago ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Confirmar Pago Cripto'}
              </button>
            </div>
          </div>
        ) :

        modoManual ? (
          <div className="p-8 animate-in slide-in-from-right duration-300">
            <button onClick={() => setModoManual(null)} className="text-sm text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1">← Volver</button>
            
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 
                ${modoManual === 'Zelle' ? 'bg-purple-100 text-purple-600' : 
                  modoManual === 'Zinli' ? 'bg-pink-100 text-pink-600' : 
                  'bg-emerald-100 text-emerald-600'}`}>
                {modoManual === 'Zinli' || modoManual === 'Zelle' ? <DollarSign size={32} /> : <Smartphone size={32} />}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Pagar con {modoManual}</h2>
              <p className="text-sm text-slate-500 mt-2">Transfiere el monto exacto a los siguientes datos y reporta tu referencia.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-6 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-sm text-slate-500">Monto a pagar:</span>
                <span className="font-bold text-slate-800 text-lg">${transaccion.monto}</span>
              </div>

              {modoManual === 'Zelle' && (
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Correo Zelle</p>
                    <p className="font-medium text-slate-800">{comercio.zelle_email}</p>
                  </div>
                  <button onClick={() => copiarTexto(comercio.zelle_email, 'Correo copiado')} className="p-2 hover:bg-slate-200 rounded-lg"><Copy size={16} className="text-slate-500" /></button>
                </div>
              )}

              {modoManual === 'Zinli' && (
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Correo Zinli</p>
                    <p className="font-medium text-slate-800">{comercio.zinli_email}</p>
                  </div>
                  <button onClick={() => copiarTexto(comercio.zinli_email, 'Correo copiado')} className="p-2 hover:bg-slate-200 rounded-lg"><Copy size={16} className="text-slate-500" /></button>
                </div>
              )}

              {modoManual === 'Pago Móvil' && (
                <>
                  <div className="flex justify-between items-center pt-2">
                    <div><p className="text-xs text-slate-400 uppercase font-bold">Banco</p><p className="font-medium text-slate-800">{comercio.pago_movil_banco}</p></div>
                    <button onClick={() => copiarTexto(comercio.pago_movil_banco, 'Banco copiado')} className="p-2 hover:bg-slate-200 rounded-lg"><Copy size={16} className="text-slate-500" /></button>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div><p className="text-xs text-slate-400 uppercase font-bold">Cédula / RIF</p><p className="font-medium text-slate-800">{comercio.pago_movil_cedula}</p></div>
                    <button onClick={() => copiarTexto(comercio.pago_movil_cedula, 'Cédula copiada')} className="p-2 hover:bg-slate-200 rounded-lg"><Copy size={16} className="text-slate-500" /></button>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div><p className="text-xs text-slate-400 uppercase font-bold">Teléfono</p><p className="font-medium text-slate-800">{comercio.pago_movil_tel}</p></div>
                    <button onClick={() => copiarTexto(comercio.pago_movil_tel, 'Teléfono copiado')} className="p-2 hover:bg-slate-200 rounded-lg"><Copy size={16} className="text-slate-500" /></button>
                  </div>
                </>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Número de Referencia</label>
              <input 
                type="text" 
                placeholder="Ej: 12345678" 
                value={referenciaManual}
                onChange={(e) => setReferenciaManual(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <button 
              onClick={() => enviarReporteManual()} 
              disabled={procesandoPago} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex justify-center items-center transition-all shadow-md"
            >
              {procesandoPago ? <Loader2 className="animate-spin" size={20} /> : 'Reportar Pago'}
            </button>
          </div>
        ) : 

        (
          <>
            <div className="bg-slate-800 p-8 text-center border-b border-slate-700">
              <Building2 className="text-slate-400 mx-auto mb-3" size={32} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Estás pagando a</p>
              <h2 className="text-xl font-bold text-white mb-4">{transaccion.comercio?.nombre || 'Tienda Segura'}</h2>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-bold text-white">${transaccion.monto}</span>
              </div>
              <p className="text-slate-400 text-sm mt-2">{transaccion.descripcion}</p>
            </div>

            <div className="p-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Método de Pago</h3>

              <div className="space-y-3">
                {metodosDisponibles?.paypal && (
                  <button onClick={() => setModoPayPal(true)} className="w-full group rounded-xl border-2 border-slate-200 p-4 text-left hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><CreditCard size={24} /></div>
                      <div><p className="font-bold text-slate-800 group-hover:text-blue-600">Tarjetas / PayPal</p><p className="text-xs text-slate-500">Paga seguro con crédito o débito.</p></div>
                    </div>
                  </button>
                )}

                {metodosDisponibles?.web3 && (
                  <button onClick={iniciarPagoWeb3} className="w-full group rounded-xl border-2 border-slate-200 p-4 text-left hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Wallet size={24} /></div><div><p className="font-bold text-slate-800 group-hover:text-blue-600">Cripto Directo (Web3)</p><p className="text-xs text-slate-500">Paga con USDT. Sin intermediarios.</p></div></div>
                  </button>
                )}

                {/* BOTÓN BINANCE MODIFICADO PARA ABRIR EL QR */}
                {metodosDisponibles?.binance && (
                  <button onClick={() => setModoBinance(true)} className="w-full rounded-xl border-2 border-[#FCD535] bg-[#FCD535]/10 p-4 text-left hover:bg-[#FCD535]/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-[#FCD535] text-black"><QrCode size={24} /></div><div><p className="font-bold text-slate-900">USDT / Binance Pay</p><p className="text-xs text-slate-600">Abre tu app, escanea el QR y listo.</p></div></div>
                  </button>
                )}

                {metodosDisponibles?.zelle && (
                  <button onClick={() => setModoManual('Zelle')} className="w-full group rounded-xl border-2 border-slate-200 p-4 text-left hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><DollarSign size={24} /></div><div><p className="font-bold text-slate-800 group-hover:text-purple-600">Zelle</p><p className="text-xs text-slate-500">Transferencia rápida en dólares.</p></div></div>
                  </button>
                )}

                {metodosDisponibles?.zinli && (
                  <button onClick={() => setModoManual('Zinli')} className="w-full group rounded-xl border-2 border-slate-200 p-4 text-left hover:border-pink-500 hover:bg-pink-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors"><DollarSign size={24} /></div><div><p className="font-bold text-slate-800 group-hover:text-pink-600">Zinli</p><p className="text-xs text-slate-500">Pago instantáneo con billetera Zinli.</p></div></div>
                  </button>
                )}

                {metodosDisponibles?.pago_movil && (
                  <button onClick={() => setModoManual('Pago Móvil')} className="w-full group rounded-xl border-2 border-slate-200 p-4 text-left hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Smartphone size={24} /></div><div><p className="font-bold text-slate-800 group-hover:text-emerald-600">Pago Móvil (Bs)</p><p className="text-xs text-slate-500">Pago interbancario. Tasa BCV.</p></div></div>
                  </button>
                )}

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}