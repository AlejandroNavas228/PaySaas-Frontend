import React, { useState, useEffect } from 'react';
import { Key, Webhook, Copy, CheckCircle2, Save, Code2, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Desarrolladores() {
  const [apiKey, setApiKey] = useState('Cargando...');
  const [webhook, setWebhook] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [copiadoCodigo, setCopiadoCodigo] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  // 💡 NUEVO ESTADO: Para saber si estamos probando el webhook
  const [probando, setProbando] = useState(false);
  
  const [configCompleta, setConfigCompleta] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem('token');
      const comercioId = localStorage.getItem('comercioId');

      if (!token || !comercioId) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${comercioId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setApiKey(data.api_key || 'No se encontró API Key');
          setWebhook(data.url_webhook || '');
          setConfigCompleta(data);
        }
      } catch (error) {
        toast.error('Error al cargar credenciales.');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  const guardarWebhook = async () => {
    setGuardando(true);
    const token = localStorage.getItem('token');
    const comercioId = localStorage.getItem('comercioId');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${comercioId}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...configCompleta, 
          url_webhook: webhook 
        })
      });

      if (response.ok) {
        toast.success('Webhook guardado correctamente.');
      } else {
        toast.error('Error al guardar el Webhook.');
      }
    } catch (error) {
      toast.error('Error de conexión.');
    } finally {
      setGuardando(false);
    }
  };

  // 💡 NUEVA FUNCIÓN: Probar conexión con el servidor del cliente
  const probarWebhook = async () => {
    if (!webhook) {
      return toast.error('Ingresa una URL antes de probar');
    }
    
    // Validar formato de URL rápido
    if (!webhook.startsWith('http')) {
      return toast.error('La URL debe empezar con http:// o https://');
    }

    setProbando(true);
    
    // Simulamos los datos exactos que enviará Lumina cuando un pago sea aprobado
    const datosDePrueba = {
      evento: 'pago_exitoso',
      data: {
        id: `test_${Math.floor(Math.random() * 10000)}`,
        monto: 25.50,
        moneda: 'USD',
        estado: 'aprobado',
        referenciaComercio: 'TEST-WEBHOOK-001',
        descripcion: 'Transacción de prueba de conexión',
        fecha: new Date().toISOString()
      }
    };

    try {
      const response = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}` // Usamos la misma API Key para que prueben seguridad
        },
        body: JSON.stringify(datosDePrueba)
      });

      if (response.ok) {
        toast.success('¡Conexión Exitosa! El servidor respondió correctamente.', { duration: 4000 });
      } else {
        toast.error(`El servidor recibió los datos pero devolvió error: ${response.status}`);
      }
    } catch (error) {
      toast.error('Fallo de conexión. Revisa que la URL exista y permita peticiones externas (CORS).', { duration: 5000 });
    } finally {
      setProbando(false);
    }
  };

  const copiarAlPortapapeles = (texto, tipo) => {
    navigator.clipboard.writeText(texto);
    if (tipo === 'api') {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } else {
      setCopiadoCodigo(true);
      setTimeout(() => setCopiadoCodigo(false), 2000);
    }
  };

  // Ya tenías esto dinámico con ${apiKey}, ¡excelente práctica!
  const codigoEjemplo = `const url = '${import.meta.env.VITE_API_URL || 'https://lumina-backend.onrender.com'}/api/checkout';
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${apiKey}" // Tu llave privada
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
  .then(data => console.log("Abre este link:", data.url_pago));`;

  if (cargando) {
    return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Desarrolladores</h1>
        <p className="text-slate-500">Conecta Lumina a cualquier tienda online usando nuestra API REST.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: Credenciales */}
        <div className="space-y-6 flex flex-col h-full">
          
          {/* TARJETA API KEY */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Key size={24} /></div>
              <h2 className="text-xl font-bold text-white">Tu Llave Maestra</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4 relative z-10">
              Esta es tu <strong className="text-blue-400">API Key Privada</strong>. Úsala en los Headers de tus peticiones. No la compartas con nadie.
            </p>
            <div className="flex gap-2 relative z-10">
              <input 
                type="password" 
                value={apiKey} 
                readOnly 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 font-mono text-sm focus:outline-none" 
              />
              <button 
                onClick={() => copiarAlPortapapeles(apiKey, 'api')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl transition-colors flex items-center justify-center min-w-[56px]"
                title="Copiar API Key"
              >
                {copiado ? <CheckCircle2 size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          {/* TARJETA WEBHOOK */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Webhook size={24} /></div>
              <h2 className="text-xl font-bold text-slate-800">Endpoint de Webhook</h2>
            </div>
            <p className="text-slate-500 text-sm mb-6 flex-1">
              Ingresa la URL de tu servidor donde Lumina enviará notificaciones automáticas (POST) cuando un pago sea aprobado.
            </p>
            <div className="flex flex-col gap-4">
              <input 
                type="url" 
                placeholder="https://api.tutienda.com/webhook/lumina" 
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" 
              />
              
              {/* 💡 AQUÍ AGREGAMOS LA DOBLE BOTONERA */}
              <div className="flex flex-col sm:flex-row gap-3 self-end w-full sm:w-auto mt-2">
                <button 
                  onClick={probarWebhook}
                  disabled={probando || !webhook}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {probando ? <Activity size={18} className="animate-pulse text-blue-500" /> : <Activity size={18} />}
                  {probando ? 'Enviando...' : 'Probar Conexión'}
                </button>
                <button 
                  onClick={guardarWebhook}
                  disabled={guardando}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all ${guardando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20'}`}
                >
                  <Save size={18} /> {guardando ? 'Guardando...' : 'Guardar Webhook'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Código de Integración (Sin cambios, ya era perfecta) */}
        <div className="bg-[#1E1E1E] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#252526]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex gap-2">
              <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                <Code2 size={14}/> Node.js / Fetch
              </span>
            </div>
          </div>
          
          <div className="p-6 relative flex-1 overflow-hidden flex flex-col">
            <button 
              onClick={() => copiarAlPortapapeles(codigoEjemplo, 'codigo')}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors z-10"
              title="Copiar Código"
            >
              {copiadoCodigo ? <CheckCircle2 size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
            <pre className="text-sm font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap flex-1">
              <code>{codigoEjemplo}</code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}