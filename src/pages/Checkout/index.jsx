import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { 
  CheckCircle2, Copy, CreditCard, Wallet, Smartphone, 
  Landmark, Mail, ShieldCheck, Loader2, ChevronRight, ArrowLeft 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import LogoLumina from '../../components/ui/LogoLumina';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [transaccion, setTransaccion] = useState(null);
  const [comercio, setComercio] = useState(null);
  
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [referenciaManual, setReferenciaManual] = useState('');
  const [pagoExitoso, setPagoExitoso] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          setTransaccion(data.transaccion);
          setComercio(data.comercio);
        } else {
          toast.error("Enlace de pago no válido");
        }
      } catch (error) {
        toast.error("Error al conectar con el servidor");
        console.error("Error al conectar con el servidor:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, [id]);

  const copiarTexto = (texto, msj) => {
    navigator.clipboard.writeText(texto);
    toast.success(msj);
  };

  const confirmarPagoManual = async () => {
    if (!referenciaManual) return toast.error("Ingresa el número de referencia");
    setProcesando(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/${id}/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          metodo: metodoSeleccionado, 
          referencia: referenciaManual 
        })
      });

      if (res.ok) {
        setPagoExitoso(true);
      } else {
        toast.error("Error al registrar el pago");
      }
    } catch (error) {
      console.error("Error de red:", error);
      toast.error("Error de red");
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (pagoExitoso) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-slate-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Reporte Recibido!</h2>
        <p className="text-slate-500 mb-8">Tu pago ha sido registrado y está en proceso de verificación por el comercio.</p>
        <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-sm text-slate-600 font-medium">
          Referencia: <span className="font-mono text-slate-900">{referenciaManual || 'PayPal/Web3'}</span>
        </div>
       <button 
          onClick={() => {
            if (transaccion.urlExito) {
              window.location.href = transaccion.urlExito;
            } else {
              window.location.href = 'https://www.google.com'; 
            }
          }} 
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors"
        >
          {transaccion.urlExito ? 'Volver a la Tienda' : 'Salir de forma segura'}
        </button>
        <p className="text-xs text-slate-400 mt-4">Ya puedes cerrar esta pestaña de forma segura.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      <Toaster position="top-center" />

      {/* RESUMEN DE ORDEN (IZQUIERDA) */}
      <div className="w-full md:w-1/3 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between">
        <div>
          <LogoLumina className="mb-12" />
          <div className="space-y-6">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Pagando a</p>
              <h2 className="text-2xl font-bold">{comercio?.nombre}</h2>
            </div>
            <div className="py-6 border-y border-white/10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Concepto</p>
              <p className="text-lg text-slate-200">{transaccion?.descripcion || 'Compra General'}</p>
            </div>
            <div className="pt-4">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total a Pagar</p>
              <h1 className="text-5xl font-black">${transaccion?.monto} <span className="text-xl text-slate-500">{transaccion?.moneda}</span></h1>
            </div>
          </div>
        </div>
        <div className="mt-12 flex items-center gap-2 text-slate-500 text-xs bg-white/5 p-4 rounded-2xl">
          <ShieldCheck size={16} className="text-blue-400" />
          Transacción protegida por cifrado SSL de 256 bits.
        </div>
      </div>

      {/* SELECCIÓN DE PAGO (DERECHA) */}
      <div className="flex-1 p-6 md:p-16 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          {!metodoSeleccionado ? (
            <>
              <h3 className="text-xl font-bold text-slate-800 mb-8">Selecciona tu método de pago</h3>
              <div className="grid gap-4">
                <MetodoCard 
                  titulo="Pago Móvil" sub="Bolívares (Tasa BCV)" 
                  icon={<Smartphone className="text-green-600"/>} 
                  onClick={() => setMetodoSeleccionado('Pago Móvil')}
                />
                <MetodoCard 
                  titulo="PayPal / Tarjetas" sub="Crédito o Débito Internacional" 
                  icon={<CreditCard className="text-blue-600"/>} 
                  onClick={() => setMetodoSeleccionado('PayPal')}
                />
                <MetodoCard 
                  titulo="Zelle / Zinli" sub="Transferencia Directa" 
                  icon={<Mail className="text-purple-600"/>} 
                  onClick={() => setMetodoSeleccionado('Zelle')}
                />
                <MetodoCard 
                  titulo="Cripto (USDT)" sub="Red BSC / Binance" 
                  icon={<Wallet className="text-amber-500"/>} 
                  onClick={() => setMetodoSeleccionado('Web3')}
                />
              </div>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button onClick={() => setMetodoSeleccionado(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm mb-8 transition-colors">
                <ArrowLeft size={16}/> Volver a métodos
              </button>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Pagar con {metodoSeleccionado}</h3>
              <p className="text-slate-500 mb-8 text-sm">Sigue las instrucciones para completar tu transferencia.</p>

              {/* LÓGICA DE PAGO MÓVIL (DATOS RESTAURADOS) */}
              {metodoSeleccionado === 'Pago Móvil' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <DatoFila etiqueta="Banco" valor={comercio.pago_movil_banco} icono={<Landmark size={18}/>} alCopiar={() => copiarTexto(comercio.pago_movil_banco, "Banco copiado")} />
                    <DatoFila etiqueta="Cédula / RIF" valor={comercio.pago_movil_cedula} alCopiar={() => copiarTexto(comercio.pago_movil_cedula, "ID copiado")} />
                    <DatoFila etiqueta="Teléfono" valor={comercio.pago_movil_tel} alCopiar={() => copiarTexto(comercio.pago_movil_tel, "Teléfono copiado")} />
                  </div>
                  <InputReferencia valor={referenciaManual} onChange={setReferenciaManual} disabled={procesando} onConfirm={confirmarPagoManual} />
                </div>
              )}

              {/* LÓGICA DE PAYPAL (CLIENT_ID DINÁMICO) */}
              {metodoSeleccionado === 'PayPal' && (
                <div className="mt-4 min-h-[300px]">
                  {comercio.paypal_client_id ? (
                    <PayPalScriptProvider options={{ "client-id": comercio.paypal_client_id }}>
                      <PayPalButtons 
                        style={{ layout: "vertical", shape: "rect", color: "blue" }}
                        createOrder={(data, actions) => {
                          // 💡 CORRECCIÓN: Forzamos 2 decimales y especificamos USD
                          const montoFormateado = Number(transaccion.monto).toFixed(2);
                          return actions.order.create({
                            purchase_units: [{ 
                              amount: { 
                                value: montoFormateado,
                                currency_code: 'USD'
                              } 
                            }]
                          });
                        }}
                        onApprove={async (data, actions) => {
                          setProcesando(true);
                          try {
                            await actions.order.capture();
                            
                            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/${id}/confirmar`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                metodo: 'PayPal', 
                                referencia: data.orderID 
                              })
                            });

                            if (res.ok) {
                              setReferenciaManual(data.orderID);
                              setPagoExitoso(true);
                            }
                          } catch (err) {
                            console.error("Error al procesar el pago:", err);
                            toast.error("Error al procesar con el servidor");
                          } finally { setProcesando(false); }
                        }}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <div className="p-8 text-center bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                      El comercio no ha configurado PayPal correctamente.
                    </div>
                  )}
                </div>
              )}

              {/* LÓGICA ZELLE / ZINLI */}
              {metodoSeleccionado === 'Zelle' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <DatoFila etiqueta="Email Zelle" valor={comercio.zelle_email} alCopiar={() => copiarTexto(comercio.zelle_email, "Email copiado")} />
                    <DatoFila etiqueta="Email Zinli" valor={comercio.zinli_email} alCopiar={() => copiarTexto(comercio.zinli_email, "Email copiado")} />
                  </div>
                  <InputReferencia valor={referenciaManual} onChange={setReferenciaManual} disabled={procesando} onConfirm={confirmarPagoManual} />
                </div>
              )}

              {/* LÓGICA WEB3 */}
              {metodoSeleccionado === 'Web3' && (
                <div className="space-y-6">
                  <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Enviar USDT (Red BSC)</p>
                    <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs font-mono truncate">{comercio.wallet_usdt || 'No configurada'}</p>
                      <button onClick={() => copiarTexto(comercio.wallet_usdt, "Wallet copiada")} className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><Copy size={16}/></button>
                    </div>
                  </div>
                  <InputReferencia valor={referenciaManual} onChange={setReferenciaManual} disabled={procesando} onConfirm={confirmarPagoManual} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// COMPONENTES AUXILIARES PARA LIMPIEZA VISUAL
function MetodoCard({ titulo, sub, icon, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">{icon}</div>
        <div className="text-left">
          <p className="font-bold text-slate-800">{titulo}</p>
          <p className="text-xs text-slate-500 font-medium">{sub}</p>
        </div>
      </div>
      <ChevronRight className="text-slate-300 group-hover:text-blue-500" size={20} />
    </button>
  );
}

function DatoFila({ etiqueta, valor, alCopiar, icono }) {
  if (!valor) return null;
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{etiqueta}</p>
        <div className="flex items-center gap-2 font-bold text-slate-800">
          {icono} {valor}
        </div>
      </div>
      <button onClick={alCopiar} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Copy size={16}/></button>
    </div>
  );
}

function InputReferencia({ valor, onChange, disabled, onConfirm }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-black text-slate-400 uppercase mb-2">Número de Referencia / Comprobante</label>
        <input 
          type="text" value={valor} onChange={(e) => onChange(e.target.value)}
          placeholder="Ej: 092831..."
          className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-mono shadow-sm"
        />
      </div>
      <button 
        onClick={onConfirm} disabled={disabled || !valor}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {disabled ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={20}/>}
        {disabled ? 'Procesando...' : 'Confirmar Reporte de Pago'}
      </button>
    </div>
  );
}