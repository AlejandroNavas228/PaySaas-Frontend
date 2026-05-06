import React from 'react';
import { CheckCircle2, Clock, XCircle, CreditCard, Smartphone, Wallet, Mail } from 'lucide-react';

export default function TransactionsTable({ transacciones }) {
  if (!transacciones || transacciones.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No hay transacciones recientes para mostrar.
      </div>
    );
  }

  // Helper para formatear la fecha a algo legible (Ej: 14 oct, 15:30)
  const formatearFecha = (fechaString) => {
    if (!fechaString) return '--';
    const opciones = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };

  const formatearReferencia = (ref, id) => {
    if (!ref) return id?.substring(0, 8) || '---';
    if (ref.startsWith('SUB-')) {

      return `SUB-${ref.split('-')[1].substring(0, 8).toUpperCase()}...`;
    }
    // Si es un link normal y es muy largo, lo acortamos un poco
    if (ref.length > 15) return ref.substring(0, 15) + '...';
    return ref;
  };

  // Helper para darle colores e iconos bonitos a cada método de pago
  const getMetodoInfo = (metodo) => {
    const m = metodo?.toLowerCase() || '';
    if (m.includes('pago móvil')) return { icon: <Smartphone size={16}/>, color: 'text-green-700 bg-green-50 border-green-200' };
    if (m.includes('paypal')) return { icon: <CreditCard size={16}/>, color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (m.includes('web3') || m.includes('cripto')) return { icon: <Wallet size={16}/>, color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (m.includes('zelle') || m.includes('zinli')) return { icon: <Mail size={16}/>, color: 'text-purple-700 bg-purple-50 border-purple-200' };
    return { icon: <CreditCard size={16}/>, color: 'text-slate-700 bg-slate-50 border-slate-200' };
  };

  // Helper para los colores de las etiquetas de estado
  const getEstadoEstilo = (estado) => {
    switch (estado) {
      case 'aprobado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pendiente':
      case 'en_revision':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'rechazado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
            <th className="p-4 font-bold rounded-tl-xl">Ref / Fecha</th>
            <th className="p-4 font-bold">Descripción del Producto</th>
            <th className="p-4 font-bold">Método</th>
            <th className="p-4 font-bold text-right">Monto (USD)</th>
            <th className="p-4 font-bold text-center rounded-tr-xl">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transacciones.map((tx) => {
            const metodoInfo = getMetodoInfo(tx.metodo);
            return (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                {/* 1. REF Y FECHA */}
                <td className="p-4 align-middle">
                  <p className="font-mono text-sm font-bold text-slate-800">
                    {/* 1. REF Y FECHA */}
                <td className="p-4 align-middle">
                  {/* 💡 AQUÍ USAMOS NUESTRO NUEVO HELPER, y le agregamos el 'title' para verla completa al pasar el mouse */}
                  <p className="font-mono text-sm font-bold text-slate-800" title={tx.referenciaComercio}>
                    {formatearReferencia(tx.referenciaComercio, tx.id)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 capitalize">
                    {formatearFecha(tx.fecha || tx.createdAt)}
                  </p>
                </td>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 capitalize">
                    {formatearFecha(tx.fecha || tx.createdAt)}
                  </p>
                </td>

                {/* 2. DESCRIPCIÓN 100% VISIBLE */}
                <td className="p-4 align-middle">
                  <p className="text-sm text-slate-700 font-medium">
                    {tx.descripcion || 'Sin descripción'}
                  </p>
                </td>

                {/* 3. MÉTODO CON ICONO */}
                <td className="p-4 align-middle">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${metodoInfo.color}`}>
                    {metodoInfo.icon}
                    <span className="whitespace-nowrap">{tx.metodo}</span>
                  </div>
                </td>

                {/* 4. MONTO GIGANTE Y CLARO */}
                <td className="p-4 align-middle text-right">
                  <p className="text-base font-black text-slate-800 whitespace-nowrap">
                    ${Number(tx.monto).toFixed(2)}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {tx.moneda || 'USD'}
                  </p>
                </td>

                {/* 5. ESTADO */}
                <td className="p-4 align-middle text-center">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide border ${getEstadoEstilo(tx.estado)}`}>
                    {tx.estado === 'aprobado' && <CheckCircle2 size={14} />}
                    {(tx.estado === 'pendiente' || tx.estado === 'en_revision') && <Clock size={14} />}
                    {tx.estado === 'rechazado' && <XCircle size={14} />}
                    {tx.estado.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}