import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Copy, Webhook, Save, ShieldCheck } from 'lucide-react';

export default function Configuracion() {
  const [apiKey, setApiKey] = useState('Cargando...');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const comercioId = localStorage.getItem('comercioId');
  const token = localStorage.getItem('token');

  // 1. Al entrar a la pantalla, buscamos los datos de este comercio en tu base de datos
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/comercio/${comercioId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setApiKey(data.api_key || 'No generada');
          setWebhookUrl(data.url_webhook || '');
          
          // Guardamos la llave para que la pantalla de "Desarrolladores" pueda mostrarla
          if(data.api_key) localStorage.setItem('comercioApiKey', data.api_key);
        }
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar la configuración');
      }
    };
    fetchConfig();
  }, [comercioId, token]);

  // 2. Función para guardar la nueva URL del Webhook
  const handleGuardarWebhook = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/comercio/${comercioId}/webhook`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url_webhook: webhookUrl })
      });

      if (response.ok) {
        toast.success('¡Webhook actualizado correctamente!');
      } else {
        toast.error('Error al guardar el Webhook');
      }
    } catch (error) {
        console.error(error);
      toast.error('Error de conexión al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Función del botón "Copiar"
  const copiarApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API Key copiada al portapapeles');
  };

  return (
    <div className="max-w-4xl animate-fade-in pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Configuración de Integración</h1>
        <p className="text-slate-500 text-sm mt-1">Administra tus credenciales de seguridad y automatiza tu tienda.</p>
      </div>

      <div className="space-y-6">
        {/* BÓVEDA DE LA API KEY */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-3">
            <ShieldCheck className="text-blue-600" size={24} />
            <div>
              <h2 className="text-lg font-bold text-slate-800">Llave Maestra (API Key)</h2>
              <p className="text-xs text-slate-500">Usa esta llave en tu servidor para crear pagos de forma segura.</p>
            </div>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tu llave secreta</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 font-mono text-sm text-slate-800 flex items-center justify-between">
                <span className="truncate select-all">{apiKey}</span>
              </div>
              <button
                onClick={copiarApiKey}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm whitespace-nowrap"
              >
                <Copy size={16} />
                Copiar Llave
              </button>
            </div>
            <p className="text-xs text-red-500 mt-3 font-medium">⚠️ Mantén esta llave en secreto. Nunca la expongas en el código público de tu tienda.</p>
          </div>
        </div>

        {/* CAJA DEL WEBHOOK */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-3">
            <Webhook className="text-purple-600" size={24} />
            <div>
              <h2 className="text-lg font-bold text-slate-800">Mensajes de Sistema (Webhooks)</h2>
              <p className="text-xs text-slate-500">Lumina enviará un aviso silencioso a este enlace apenas un cliente pague.</p>
            </div>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">URL de tu Tienda (Endpoint)</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="Ej: https://api.zahara.com/webhook/lumina"
                className="flex-1 w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-3 text-sm text-slate-800 transition-all outline-none"
              />
              <button
                onClick={handleGuardarWebhook}
                disabled={isSaving}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm whitespace-nowrap"
              >
                <Save size={16} />
                {isSaving ? 'Guardando...' : 'Guardar URL'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}