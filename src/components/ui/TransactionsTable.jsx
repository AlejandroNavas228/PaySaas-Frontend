import React, { useState } from 'react';
import { Check, X, Clock, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionsTable({ transacciones, setTransacciones }) {
  const [accionId, setAccionId] = useState(null);

  const actualizarEstado = async (id, nuevoEstado) => {
    setAccionId(id); // Bloqueamos solo esta fila
    const toastId = toast.loading(`Cambiando estado a ${nuevoEstado}...`);
    
    try {
      // 💡 CORRECCIÓN AQUÍ: Usamos /api/pagos/ y el método PUT, exactamente como está en tu backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos/${id}/estado`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        setTransacciones(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
        toast.success(`Pago ${nuevoEstado === 'aprobado' ? 'aprobado' : 'rechazado'} con éxito`, { id: toastId });
      } else {
        toast.error("No se pudo actualizar el estado", { id: toastId });
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("Error de conexión", { id: toastId });
    } finally {
      setAccionId(null);
    }
  };

  if (transacciones.length === 0) {
    return (
      <div className="p-20 text-center text-slate-500">
        <Receipt className="mx-auto mb-4 opacity-20" size={48} />
        <p>No hay transacciones registradas aún.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-widest">
            <th className="px-6 py-4 font-semibold">Cliente / Referencia</th>
            <th className="px-6 py-4 font-semibold">Monto</th>
            <th className="px-6 py-4 font-semibold">Método</th>
            <th className="px-6 py-4 font-semibold">Estado</th>
            <th className="px-6 py-4 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {transacciones.map((t) => (
            <tr key={t.id} className="hover:bg-slate-700/20 transition-colors group">
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="text-white font-medium flex items-center gap-2">
                    {t.referenciaComercio || 'Sin Referencia'}
                    {t.referenciaComercio?.startsWith('SUB-') && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-500/30">SAAS</span>
                    )}
                  </span>
                  <span className="text-slate-500 text-xs font-mono">{t.id.slice(0, 18)}...</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className="text-white font-bold">${t.monto}</span>
                <span className="text-slate-500 text-xs ml-1">{t.moneda}</span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="capitalize">{t.metodo}</span>
                  {t.metodo === 'web3' && <ExternalLink size={12} className="text-blue-400" />}
                </div>
              </td>
              <td className="px-6 py-5">
                <StatusBadge estado={t.estado} />
              </td>
              <td className="px-6 py-5 text-right">
                <div className="flex justify-end gap-2">
                  {(t.estado === 'pendiente' || t.estado === 'en_revision') && (
                    <>
                      <button 
                        onClick={() => actualizarEstado(t.id, 'aprobado')}
                        disabled={accionId === t.id}
                        className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                        title="Aprobar Pago"
                      >
                        {accionId === t.id ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                      </button>
                      <button 
                        onClick={() => actualizarEstado(t.id, 'rechazado')}
                        disabled={accionId === t.id}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        title="Rechazar Pago"
                      >
                        {accionId === t.id ? <Loader2 className="animate-spin" size={18} /> : <X size={18} />}
                      </button>
                    </>
                  )}
                  {t.estado === 'aprobado' && (
                    <div className="flex items-center gap-1 text-green-500/50 text-xs font-bold uppercase">
                      <ShieldCheck size={14} /> Verificado
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ estado }) {
  const styles = {
    aprobado: "bg-green-500/10 text-green-500 border-green-500/20",
    rechazado: "bg-red-500/10 text-red-500 border-red-500/20",
    pendiente: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    en_revision: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  };

  const icons = {
    aprobado: <Check size={12} />,
    rechazado: <X size={12} />,
    pendiente: <Clock size={12} />,
    en_revision: <Loader2 size={12} className="animate-spin" />
  };

  return (
    <span className={`flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${styles[estado] || styles.pendiente}`}>
      {icons[estado] || icons.pendiente}
      {estado.replace('_', ' ')}
    </span>
  );
}