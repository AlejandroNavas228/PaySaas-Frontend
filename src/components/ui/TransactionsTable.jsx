import React, { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionsTable({ transacciones, setTransacciones }) {
  const [procesandoId, setProcesandoId] = useState(null);

  // 1. HELPER: Acortar referencias largas (Como los SUB_ de tus planes)
  const formatearReferencia = (ref, id) => {
    if (!ref) return id?.substring(0, 8) || '---';
    if (ref.startsWith('SUB_') || ref.startsWith('SUB-')) {
      const partes = ref.split('_');
      // Si usamos el nuevo formato con guion bajo, o el viejo con guion normal
      const plan = partes[1] || ref.split('-')[1]; 
      return `SUB-${plan}...`;
    }
    if (ref.length > 15) return ref.substring(0, 15) + '...';
    return ref;
  };

  // 2. HELPER: Formatear fecha a algo legible
  const formatearFecha = (fechaString) => {
    const opciones = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-VE', opciones); // Formato Venezuela/Latam
  };

  // 3. LÓGICA DE APROBAR / RECHAZAR
  const handleActualizarEstado = async (id, nuevoEstado) => {
    if (!setTransacciones) {
      return toast.error("Error visual: recarga la página.");
    }
    
    setProcesandoId(id);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (res.ok) {
        toast.success(`Pago ${nuevoEstado === 'aprobado' ? 'aprobado' : 'rechazado'} con éxito`);
        // Actualizamos la lista en tiempo real para que desaparezcan los botones
        setTransacciones(prev => prev.map(tx => tx.id === id ? { ...tx, estado: nuevoEstado } : tx));
      } else {
        toast.error('Error al actualizar el pago en el servidor');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setProcesandoId(null);
    }
  };

  if (!transacciones || transacciones.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Aún no hay transacciones para mostrar.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <th className="p-4">Ref / Fecha</th>
            <th className="p-4">Concepto</th>
            <th className="p-4">Monto</th>
            <th className="p-4">Estado</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transacciones.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
              
              {/* REF Y FECHA */}
              <td className="p-4 align-middle">
                <p className="font-mono text-sm font-bold text-slate-800" title={tx.referenciaComercio}>
                  {formatearReferencia(tx.referenciaComercio, tx.id)}
                </p>
                <p className="text-xs text-slate-400 mt-1 capitalize">
                  {formatearFecha(tx.fecha || tx.createdAt)}
                </p>
              </td>
              
              {/* CONCEPTO */}
              <td className="p-4 align-middle text-sm text-slate-600 font-medium">
                {tx.descripcion || 'General'}
              </td>
              
              {/* MONTO */}
              <td className="p-4 align-middle font-black text-slate-800">
                ${parseFloat(tx.monto).toFixed(2)}
              </td>
              
              {/* ESTADO */}
              <td className="p-4 align-middle">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${
                  tx.estado === 'aprobado' ? 'bg-green-50 text-green-600 border-green-200 shadow-sm' :
                  tx.estado === 'rechazado' ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' :
                  'bg-amber-50 text-amber-600 border-amber-200 shadow-sm animate-pulse'
                }`}>
                  {tx.estado === 'en_revision' ? 'En Revisión' : tx.estado}
                </span>
              </td>
              
              {/* ACCIONES (LOS BOTONES) */}
              <td className="p-4 align-middle text-right">
                {/* 💡 AQUÍ ESTÁ LA MAGIA: Mostramos botones si es en_revision O pendiente */}
                {(tx.estado === 'en_revision' || tx.estado === 'pendiente') ? (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleActualizarEstado(tx.id, 'aprobado')}
                      disabled={procesandoId === tx.id}
                      className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors shadow-sm"
                      title="Aprobar Pago"
                    >
                      {procesandoId === tx.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                    </button>
                    <button
                      onClick={() => handleActualizarEstado(tx.id, 'rechazado')}
                      disabled={procesandoId === tx.id}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors shadow-sm"
                      title="Rechazar Pago"
                    >
                       {procesandoId === tx.id ? <Loader2 size={18} className="animate-spin" /> : <X size={18} strokeWidth={3} />}
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Procesado</span>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}