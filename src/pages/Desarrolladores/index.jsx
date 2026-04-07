import React, { useState, useEffect } from 'react';
import { Terminal, Key, Copy, CheckCircle2, Code2, Server, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Desarrolladores() {
  const [apiKey, setApiKey] = useState('Cargando...');
  const [copiadoKey, setCopiadoKey] = useState(false);
  const [copiadoCodigo, setCopiadoCodigo] = useState(false);
  const [lenguaje, setLenguaje] = useState('javascript'); // javascript o curl

  useEffect(() => {
    // Obtenemos la API Key real de la base de datos
    const cargarApiKey = async () => {
      const comercioId = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/comercio/${comercioId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setApiKey(data.api_key || 'No generada');
        }
      } catch (error) {
        console.error(error);
        setApiKey('Error al cargar');
      }
    };
    cargarApiKey();
  }, []);

  const copiarTexto = (texto, tipo) => {
    navigator.clipboard.writeText(texto);
    if (tipo === 'key') {
      setCopiadoKey(true);
      toast.success('API Key copiada');
      setTimeout(() => setCopiadoKey(false), 2000);
    } else {
      setCopiadoCodigo(true);
      toast.success('Código copiado');
      setTimeout(() => setCopiadoCodigo(false), 2000);
    }
  };

  const codigoEjemplo = {
    javascript: `const url = "https://lumina-backend-3pu1.onrender.com/api/checkout";
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${apiKey}"
  },
  body: JSON.stringify({
    "monto": 25.50,
    "moneda": "USD",
    "descripcion": "Pago por productos",
    "referenciaComercio": "PEDIDO-001",
    "urlExito": "https://tutienda.com/gracias",
    "urlCancelado": "https://tutienda.com/carrito"
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(data => console.log("Abre este link:", data.url_pago));`,
    curl: `curl -X POST https://lumina-backend-3pu1.onrender.com/api/checkout \\
-H "Content-Type: application/json" \\
-H "x-api-key: ${apiKey}" \\
-d '{
  "monto": 25.50,
  "moneda": "USD",
  "descripcion": "Pago por productos",
  "referenciaComercio": "PEDIDO-001",
  "urlExito": "https://tutienda.com/gracias",
  "urlCancelado": "https://tutienda.com/carrito"
}'`
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          API & Desarrolladores <Terminal className="text-blue-600" size={28} />
        </h1>
        <p className="text-slate-500">Conecta Lumina a cualquier tienda online usando nuestra API REST.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Credenciales y Explicación */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Tarjeta de API Key */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Key size={20} /></div>
              <h2 className="text-lg font-bold text-white">Tu Llave Maestra</h2>
            </div>
            <p className="text-slate-400 text-xs mb-4">Esta es tu <span className="font-bold text-blue-400">API Key Privada</span>. Úsala en los Headers de tus peticiones. No la compartas con nadie.</p>
            
            <div className="flex bg-slate-950 border border-slate-700 rounded-xl overflow-hidden group relative">
              <input 
                type="password" 
                value={apiKey} 
                readOnly 
                className="w-full bg-transparent text-slate-300 px-4 py-3 text-sm font-mono outline-none group-hover:text-transparent transition-colors" 
              />
              <span className="absolute left-4 top-3 text-sm font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {apiKey.substring(0, 15)}...
              </span>
              <button 
                onClick={() => copiarTexto(apiKey, 'key')} 
                className="bg-blue-600 hover:bg-blue-500 px-4 py-3 transition-colors text-white"
              >
                {copiadoKey ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Información de Integración */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Server size={20} className="text-slate-400"/> Flujo de Integración</h3>
            <ul className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              <li className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <span className="text-[10px] font-bold">1</span>
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-3 rounded border border-slate-100 bg-slate-50">
                  <p className="text-xs font-bold text-slate-700">Crear Pago</p>
                  <p className="text-[10px] text-slate-500 mt-1">Tu tienda envía el monto y los datos a nuestra API.</p>
                </div>
              </li>
              <li className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-purple-100 text-purple-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <span className="text-[10px] font-bold">2</span>
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-3 rounded border border-slate-100 bg-slate-50">
                  <p className="text-xs font-bold text-slate-700">Redirección</p>
                  <p className="text-[10px] text-slate-500 mt-1">Lumina te devuelve una URL. Envía a tu cliente ahí para que pague.</p>
                </div>
              </li>
              <li className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-green-100 text-green-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <span className="text-[10px] font-bold">3</span>
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-3 rounded border border-slate-100 bg-slate-50">
                  <p className="text-xs font-bold text-slate-700">Notificación Webhook</p>
                  <p className="text-[10px] text-slate-500 mt-1">Cuando el pago se apruebe, avisamos a tu servidor en automático.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* COLUMNA DERECHA: Consola de Código */}
        <div className="lg:col-span-2">
          <div className="bg-[#1E1E1E] rounded-2xl shadow-xl border border-slate-800 overflow-hidden flex flex-col h-full">
            
            {/* Cabecera de la Consola */}
            <div className="bg-[#2D2D2D] px-4 py-3 border-b border-slate-700 flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex bg-[#1E1E1E] rounded-lg p-1">
                <button 
                  onClick={() => setLenguaje('javascript')} 
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${lenguaje === 'javascript' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Node.js / Fetch
                </button>
                <button 
                  onClick={() => setLenguaje('curl')} 
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${lenguaje === 'curl' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  cURL
                </button>
              </div>
            </div>

            {/* Editor de Código */}
            <div className="p-6 relative flex-1 group">
              <button 
                onClick={() => copiarTexto(codigoEjemplo[lenguaje], 'codigo')}
                className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiadoCodigo ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
              <pre className="text-sm font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                <code dangerouslySetInnerHTML={{ __html: codigoEjemplo[lenguaje].replace(/(["'{}:,[\]])/g, '<span class="text-blue-300">$1</span>').replace(/(http[s]?:\/\/[^\s"]+)/g, '<span class="text-green-400">$1</span>') }}></code>
              </pre>
            </div>
            
            <div className="bg-blue-900/30 px-6 py-3 border-t border-blue-900/50 flex items-center gap-2">
              <Shield size={16} className="text-blue-400" />
              <span className="text-xs font-medium text-blue-200">Endpoint de Producción: <code className="bg-blue-950 px-1 rounded">https://lumina-backend-3pu1.onrender.com/api/checkout</code></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}