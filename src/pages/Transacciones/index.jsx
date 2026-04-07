import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Clock, Search, ExternalLink } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);

  const cargarTransacciones = async () => {
    const comercioId = localStorage.getItem('comercioId');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/pagos/${comercioId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTransacciones(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar el historial.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTransacciones();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    setProcesandoId(id);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/pagos/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        toast.success(`Pago ${nuevoEstado}`);
        cargarTransacciones(); // Recargamos la tabla
      } else {
        toast.error('Error al actualizar.');
      }
    } catch (error) {
      console.error(error); 
      toast.error('Error de conexión.');
    } finally {
      setProcesandoId(null);
    }
  };

  // Funciones visuales
  const getBadgeEstado = (estado) => {
    switch (estado) {
      case 'aprobado': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 size={14}/> Aprobado</span>;
      case 'rechazado': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={14}/> Rechazado</span>;
      case 'en_revision': return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit animate-pulse"><Clock size={14}/> Requiere Revisión</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold w-fit">Pendiente</span>;
    }
  };

  if (cargando) return <div className="h-full flex justify-center items-center"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Transacciones</h1>
        <p className="text-slate-500">Administra y verifica los pagos de tus clientes en tiempo real.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold">Fecha</th>
                <th className="p-4 font-bold">Detalle</th>
                <th className="p-4 font-bold">Método</th>
                <th className="p-4 font-bold">Referencia (Cliente)</th>
                <th className="p-4 font-bold">Monto</th>
                <th className="p-4 font-bold">Estado</th>
                <th className="p-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {transacciones.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400">No hay transacciones todavía.</td></tr>
              ) : (
                transacciones.map((tx) => (
                  <tr key={tx.id} className={`hover:bg-slate-50 transition-colors ${tx.estado === 'en_revision' ? 'bg-orange-50/30' : ''}`}>
                    <td className="p-4 text-slate-500">{new Date(tx.fecha).toLocaleDateString()}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{tx.descripcion || 'Compra en tienda'}</p>
                      <p className="text-xs text-slate-400">Ref Tienda: {tx.referenciaComercio}</p>
                    </td>
                    <td className="p-4 font-medium text-slate-600 capitalize">
                      {tx.metodo.replace('_', ' ')}
                    </td>
                    <td className="p-4">
                      {tx.referencia_cliente ? (
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 font-bold">{tx.referencia_cliente}</span>
                      ) : (
                        <span className="text-slate-400 text-xs">- Automático -</span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-800">${tx.monto}</td>
                    <td className="p-4">{getBadgeEstado(tx.estado)}</td>
                    <td className="p-4 text-right">
                      {/* Botones de acción manual SOLO si está en revisión */}
                      {tx.estado === 'en_revision' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => cambiarEstado(tx.id, 'aprobado')}
                            disabled={procesandoId === tx.id}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                            title="Aprobar Pago"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => cambiarEstado(tx.id, 'rechazado')}
                            disabled={procesandoId === tx.id}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                            title="Rechazar Pago"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">No requiere acción</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}