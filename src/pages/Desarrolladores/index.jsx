import React from 'react';
import { Terminal, Key, Webhook, ShieldCheck } from 'lucide-react';

export default function Documentacion() {
  const apiKey = localStorage.getItem('comercioApiKey') || 'zp_live_tu_api_key_secreta';

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">API para Desarrolladores</h1>
        <p className="text-slate-500 text-sm mt-1">Integra Lumina en tu e-commerce o aplicación en minutos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA: Conceptos */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Key className="text-blue-600" size={20} />
              <h3 className="font-bold text-slate-800">Autenticación</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Todas las peticiones a nuestra API deben incluir tu API Key secreta en los Headers para identificar a tu empresa.
            </p>
            <div className="bg-slate-900 p-3 rounded-lg overflow-hidden">
              <p className="text-xs font-mono text-emerald-400 break-all">x-api-key: {apiKey}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Webhook className="text-purple-600" size={20} />
              <h3 className="font-bold text-slate-800">Webhooks</h3>
            </div>
            <p className="text-xs text-slate-500">
              Lumina enviará una petición POST a tu servidor automáticamente cuando un cliente complete un pago con éxito, para que puedas despachar el producto.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: Código */}
        <div className="col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-300">Crear un Pago (Node.js / React)</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-mono">POST /api/pagos/procesar</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-slate-300 leading-relaxed">
<code>{`const procesarPagoLumina = async () => {
  const response = await fetch('https://lumina-backend-3pu1.onrender.com/api/pagos/procesar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '${apiKey}' // Tu llave secreta
    },
    body: JSON.stringify({
      monto: 50.00,
      moneda: 'USD',
      metodo: 'tarjeta',
      referencia: 'PEDIDO-001' // El ID de la orden en tu tienda
    })
  });

  const data = await response.json();
  console.log(data.recibo);
};`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}