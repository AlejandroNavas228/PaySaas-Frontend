import React from 'react';

// Simulamos los datos que vendrían de tu base de datos
const pagosDummy = [
  { id: 'TRX-001', cliente: 'María López', monto: '45.00', moneda: 'USD', metodo: 'Zelle', fecha: '13 Mar, 10:30 AM', estado: 'Aprobado' },
  { id: 'TRX-002', cliente: 'Carlos Ruiz', monto: '1.620,00', moneda: 'VES', metodo: 'Pago Móvil (BDV)', fecha: '13 Mar, 11:15 AM', estado: 'Pendiente' },
  { id: 'TRX-003', cliente: 'Ana Silva', monto: '22.50', moneda: 'USD', metodo: 'Tarjeta Crédito', fecha: '13 Mar, 01:45 PM', estado: 'Aprobado' },
  { id: 'TRX-004', cliente: 'Pedro Gómez', monto: '850,00', moneda: 'VES', metodo: 'Pago Móvil (Banesco)', fecha: '13 Mar, 02:10 PM', estado: 'Fallido' },
];

export default function TransactionsTable() {
  // Función para dar color al estado del pago
  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'Aprobado': return 'bg-green-100 text-green-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'Fallido': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
            <th className="py-3 px-4 font-medium">ID Transacción</th>
            <th className="py-3 px-4 font-medium">Cliente</th>
            <th className="py-3 px-4 font-medium">Método</th>
            <th className="py-3 px-4 font-medium">Fecha</th>
            <th className="py-3 px-4 font-medium text-right">Monto</th>
            <th className="py-3 px-4 font-medium text-center">Estado</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {pagosDummy.map((pago) => (
            <tr key={pago.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-gray-500">{pago.id}</td>
              <td className="py-3 px-4 font-medium">{pago.cliente}</td>
              <td className="py-3 px-4">{pago.metodo}</td>
              <td className="py-3 px-4 text-gray-500">{pago.fecha}</td>
              <td className="py-3 px-4 text-right font-medium">
                {pago.moneda === 'USD' ? '$' : 'Bs.'} {pago.monto}
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeColor(pago.estado)}`}>
                  {pago.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}