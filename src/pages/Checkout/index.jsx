import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, ShieldCheck, CreditCard, Loader2, CheckCircle2, QrCode, Wallet, Copy, Smartphone, DollarSign, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// 1. MEJORA VISUAL: Esqueleto de Carga Elegante
const SkeletonLoader = () => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 w-full">
    <div className="text-center mb-8 w-full max-w-md">
      <div className="w-48 h-8 bg-slate-800 rounded-lg animate-pulse mx-auto mb-2"></div>
      <div className="w-32 h-4 bg-slate-800 rounded-lg animate-pulse mx-auto"></div>
    </div>
    <div className="bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8 border border-slate-700">
      <div className="w-full h-12 bg-slate-700 rounded-xl animate-pulse mb-6"></div>
      <div className="w-3/4 h-8 bg-slate-700 rounded-lg animate-pulse mx-auto mb-8"></div>
      <div className="space-y-4">
        <div className="w-full h-16 bg-slate-700 rounded-xl animate-pulse"></div>
        <div className="w-full h-16 bg-slate-700 rounded-xl animate-pulse"></div>
        <div className="w-full h-16 bg-slate-700 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

// 2. MEJORA VISUAL: Spinner Unificado para los botones
const BotonCargando = ({ texto = "Procesando..." }) => (
  <span className="flex items-center justify-center gap-2">
    <Loader2 className="animate-spin" size={20} /> {texto}
  </span>
);

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
  const [modoBinance, setModoBinance] = useState(false);

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
        toast.dismiss(toastId); // SOLO ocultamos el toast de carga, ya no mandamos el toast de éxito doble
        setPagoExitoso(true);
        if (transaccion?.urlExito) setTimeout(() => { window.location.href = transaccion.urlExito; }, 3000);
      } else {
        toast.error(data.error || 'Error verificando en Lumina.', { id: toastId });
      }
    } catch (err) {
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
      } else { 
        toast.error(data.error || 'La tienda no acepta Web3 aún.', { id: toastId }); 
      }
    } catch (err) { 
      toast.error('Error de red.', { id: toastId }); 
    } finally { 
      setProcesandoPago(false); 
    }
  };

  const verificarPagoWeb3 = async () => {
    setProcesandoPago(true);
    const toastId = toast.loading('📡 Escaneando Blockchain...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/${id}/verificar-crypto`, { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        toast.dismiss(toastId); // Eliminado el doble toast de éxito
        setPagoExitoso(true);
        if (transaccion?.urlExito) setTimeout(() => { window.location.href = transaccion.urlExito; }, 3000);
      } else { 
        toast.error(data.error || 'Aún no vemos el pago.', { id: toastId }); 
      }
    } catch (err) { 
      toast.error('Error contactando al radar.', { id: toastId }); 
    } finally {
      setProcesandoPago(false);
    }
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
        toast.dismiss(toastId); // Solo pantalla grande de En Revisión
        setPagoEnRevision(true);
      } else { 
        toast.error(data.error || 'Error al reportar.', { id: toastId }); 
      }
    } catch (err) { 
      toast.error('Error de red.', { id: toastId }); 
    } finally { 
      setProcesandoPago(false); 
    }
  };

  // 3. USO DEL SKELETON
  if (cargando) return <SkeletonLoader />;
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
        
        {/* 4. PANTALLA DE ÉXITO PREMIUM (EL RECIBO DIGITAL) */}
        {pagoExitoso ? (
          <div className="p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-green-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">¡Pago Exitoso!</h2>
            <p className="text-slate-500 mb-6 text-sm">Tu transacción fue verificada al instante.</p>
            
            {/* El Recibo */}
            <div className="w-full bg-slate-50 rounded-2xl p-5 mb-6 text-left border border-slate-100 shadow-inner">
              <p className="text-xs font-bold text-slate-400 uppercase mb-3 text-center border-b border-slate-200 pb-2">Recibo Digital</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-500 text-sm">Monto pagado:</span>
                <span className="font-bold text-slate-800 text-lg">${transaccion?.monto} {transaccion?.moneda}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-500 text-sm">Comercio:</span>
                <span className="font-bold text-slate-800">{comercio?.nombre}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Cod. Referencia:</span>
                <span className="font-mono text-xs text-slate-600 bg-slate-200 px-2 py-1 rounded">{transaccion?.id?.slice(-8).toUpperCase()}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 flex items-center gap-1 justify-center">
              <ShieldCheck size={14} /> Transacción segura y encriptada por Lumina
            </p>

            {transaccion?.urlExito ? (
              <button onClick={() => window.location.href = transaccion.urlExito} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md">
                Volver a la tienda
              </button>
            ) : (
              <p className="text-sm text-slate-500 font-medium">Puedes cerrar esta pestaña de forma segura.</p>
            )}
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
              <button onClick={() => window.location.href = transaccion.urlExito} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md">
                Volver a la tienda
              </button>
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
            <button onClick={verificarPagoWeb3} disabled={procesandoPago} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:opacity-50">
              {procesandoPago ? <BotonCargando texto="Escaneando red..." /> : <span className="flex items-center justify-center gap-2"><ShieldCheck size={20} /> Ya pagué, verificar transacción</span>}
            </button>
          </div>
        ) : 

        modoBinance ? (
          <div className="p-8 animate-in slide-in-from-right duration-300 bg-slate-900 text-white">
            <button onClick={() => setModoBinance(false)} className="text-sm text-slate-400 hover:text-white mb-4 flex items-center gap-1">← Volver</button>
            <div className="text-center">
              <h2 className="text-2xl font-black text-yellow-400 mb-1">Binance Pay</h2>
              <p className="text-slate-400 text-sm mb-6">Escanea el código desde tu app de Binance.</p>
              
              <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-xl shadow-yellow-500/10 border-4 border-slate-700">
                <QRCodeSVG value={comercio?.wallet_usdt || 'Error: Billetera no configurada'} size={180} level={"H"} fgColor="#0F172A" />
              </div>
              
              <div className="text-left mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">ID de Transacción (TXID)</label>
                <input type="text" placeholder="Ej: 8a7b6c5d4e..." value={referenciaManual} onChange={(e) => setReferenciaManual(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-mono text-sm" />
              </div>
              
              <button onClick={() => enviarReporteManual('Binance USDT')} disabled={procesandoPago || !referenciaManual} className="w-full bg-[#FCD535] hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                {procesandoPago ? <BotonCargando texto="Confirmando..." /> : 'Confirmar Pago Cripto'}
              </button>
            </div>
          </div>
        ) : 

        modoManual ? (
          <div className="p-8 animate-in slide-in-from-right duration-300">
            <button onClick={() => setModoManual(null)} className="text-sm text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1">← Volver</button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Pago con {modoManual}</h2>
              <p className="text-slate-500">Transfiere el monto exacto a los siguientes datos y reporta tu referencia.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 space-y-3">
              {modoManual === 'Zelle' && (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Correo Zelle</p>
                    <p className="font-medium text-slate-800">{comercio.zelle_email}</p>
                  </div>
                  <button onClick={() => copiarTexto(comercio.zelle_email, 'Correo copiado')} className="p-2 hover:bg-slate-200 rounded-lg">
                    <Copy size={16} className="text-slate-500" />
                  </button>
                </div>
              )}
              {modoManual === 'Zinli' && (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Correo Zinli</p>
                    <p className="font-medium text-slate-800">{comercio.zinli_email}</p>
                  </div>
                  <button onClick={() => copiarTexto(comercio.zinli_email, 'Correo copiado')} className="p-2 hover:bg-slate-200 rounded-lg">
                    <Copy size={16} className="text-slate-500" />
                  </button>
                </div>
              )}
              {modoManual === 'Pago Móvil' && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Banco</p>
                      <p className="font-medium text-slate-800">{comercio.pago_movil_banco}</p>
                    </div>
                    <button onClick={() => copiarTexto(comercio.pago_movil_banco, 'Banco copiado')} className="p-2 hover:bg-slate-200 rounded-lg">
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Cédula / RIF</p>
                      <p className="font-medium text-slate-800">{comercio.pago_movil_cedula}</p>
                    </div>
                    <button onClick={() => copiarTexto(comercio.pago_movil_cedula, 'Cédula copiada')} className="p-2 hover:bg-slate-200 rounded-lg">
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Teléfono</p>
                      <p className="font-medium text-slate-800">{comercio.pago_movil_tel}</p>
                    </div>
                    <button onClick={() => copiarTexto(comercio.pago_movil_tel, 'Teléfono copiado')} className="p-2 hover:bg-slate-200 rounded-lg">
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Número de Referencia</label>
              <input type="text" placeholder="Ej: 12345678" value={referenciaManual} onChange={(e) => setReferenciaManual(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-mono" />
            </div>
            
            <button onClick={() => enviarReporteManual()} disabled={procesandoPago || !referenciaManual} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:opacity-50">
              {procesandoPago ? <BotonCargando texto="Enviando..." /> : 'Confirmar y Reportar'}
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
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Pago con Tarjeta</h2>
              <p className="text-slate-500 text-sm">Transacción procesada por PayPal.</p>
            </div>
            <PayPalScriptProvider options={{ "client-id": comercio.paypal_client_id, currency: "USD" }}>
              <PayPalButtons 
                style={{ layout: "vertical", shape: "rect", color: "blue" }}
                createOrder={(data, actions) => { return actions.order.create({ purchase_units: [{ amount: { value: transaccion.monto.toString() } }] }); }}
                onApprove={async (data, actions) => { await actions.order.capture(); await procesarPagoPayPal(data.orderID); }}
                onError={(err) => { toast.error("Error al conectar con el banco."); }}
                
                
              />
            </PayPalScriptProvider>
          </div>
        ) : 

        (
          <div className="p-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Building2 className="text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Comercio Verificado</p>
                <h2 className="text-xl font-bold text-slate-800">{comercio.nombre}</h2>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center mb-8">
              <p className="text-sm text-slate-500 font-medium mb-1">Total a Pagar</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">${transaccion.monto} <span className="text-xl text-slate-400 font-semibold">{transaccion.moneda}</span></h3>
              {transaccion.descripcion && <p className="text-slate-500 mt-2 text-sm">{transaccion.descripcion}</p>}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Selecciona tu método de pago</p>
              
              {metodosDisponibles?.binance && (
                <button onClick={() => setModoBinance(true)} className="w-full bg-[#FCD535] hover:bg-yellow-400 p-4 rounded-xl flex items-center gap-4 transition-all group shadow-sm">
                  <div className="w-10 h-10 bg-slate-900 text-yellow-400 rounded-lg flex items-center justify-center"><QrCode size={20} /></div>
                  <div className="text-left"><p className="font-bold text-slate-900">Binance Pay</p><p className="text-xs text-slate-700">Rápido y sin comisiones.</p></div>
                </button>
              )}

              {metodosDisponibles?.web3 && (
                <button onClick={iniciarPagoWeb3} disabled={procesandoPago} className="w-full bg-slate-900 hover:bg-slate-800 p-4 rounded-xl flex items-center gap-4 transition-all group disabled:opacity-70">
                  <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors"><Wallet size={20} /></div>
                  <div className="text-left">
                    <p className="font-bold text-white">{procesandoPago ? 'Conectando bóveda...' : 'USDT / Cripto (Web3)'}</p>
                    <p className="text-xs text-slate-400">Paga con tu billetera descentralizada.</p>
                  </div>
                </button>
              )}

              {metodosDisponibles?.paypal && (
                <button onClick={() => setModoPayPal(true)} className="w-full bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md p-4 rounded-xl flex items-center gap-4 transition-all group">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors"><CreditCard size={24} /></div>
                  <div className="text-left"><p className="font-bold text-slate-800 group-hover:text-blue-600">Tarjeta de Crédito</p><p className="text-xs text-slate-500">Procesado de forma segura.</p></div>
                </button>
              )}

              {metodosDisponibles?.pago_movil && (
                <button onClick={() => setModoManual('Pago Móvil')} className="w-full bg-white border border-slate-200 hover:border-green-500 hover:shadow-md p-4 rounded-xl flex items-center gap-4 transition-all group">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors"><Smartphone size={24} /></div>
                  <div className="text-left"><p className="font-bold text-slate-800 group-hover:text-green-600">Pago Móvil</p><p className="text-xs text-slate-500">Bolívares a la tasa del día.</p></div>
                </button>
              )}

              {metodosDisponibles?.zelle && (
                <button onClick={() => setModoManual('Zelle')} className="w-full bg-white border border-slate-200 hover:border-purple-500 hover:shadow-md p-4 rounded-xl flex items-center gap-4 transition-all group">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors"><DollarSign size={24} /></div>
                  <div className="text-left"><p className="font-bold text-slate-800 group-hover:text-purple-600">Zelle</p><p className="text-xs text-slate-500">Transferencia rápida en dólares.</p></div>
                </button>
              )}

              {metodosDisponibles?.zinli && (
                <button onClick={() => setModoManual('Zinli')} className="w-full bg-white border border-slate-200 hover:border-red-500 hover:shadow-md p-4 rounded-xl flex items-center gap-4 transition-all group">
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors"><CreditCard size={24} /></div>
                  <div className="text-left"><p className="font-bold text-slate-800 group-hover:text-red-600">Zinli</p><p className="text-xs text-slate-500">Billetera virtual internacional.</p></div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}