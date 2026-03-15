import React from 'react';
import SummaryCard from '../../components/ui/SummaryCard';
import TransactionsTable from '../../components/ui/TransactionsTable'; // Importamos la tabla

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Resumen Financiero</h2>
        <p className="text-gray-500 text-sm">Monitorea los ingresos de tu tienda en tiempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Ingresos Totales (Hoy)" 
          amount="$ 450.00" 
          subtitle="+12% en comparación a ayer"
          colorClass="text-green-600"
        />
        <SummaryCard 
          title="Pagos Pendientes" 
          amount="12" 
          subtitle="Requieren verificación manual"
          colorClass="text-yellow-500"
        />
        <SummaryCard 
          title="Ventas Completadas" 
          amount="34" 
          subtitle="Transacciones exitosas de hoy"
          colorClass="text-blue-600"
        />
      </div>

      {/* Aquí insertamos la tabla real */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Transacciones Recientes</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">
            Ver todas
          </button>
        </div>
        
        <TransactionsTable />
        
      </div>

    </div>
  );
}