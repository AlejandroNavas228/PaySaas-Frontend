import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Receipt, Search, Download, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Creamos la función asíncrona (¡esta es la que faltaba!)
    const cargarPagos = async () => {
      const comercioId = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token');

      if (!comercioId || !token) {
        navigate('/login');
        return;
      }

      try {
        // 2. Enviamos la petición con el Token
        const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/pagos/${comercioId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTransacciones(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar transacciones');
      } finally {
        setIsLoading(false);
      }
    };

    // 3. Ejecutamos la función
    cargarPagos();
  }, [navigate]);
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(transacciones);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Transacciones");
    XLSX.writeFile(libro, "Historial_Lumina.xlsx");
    toast.success('¡Historial descargado exitosamente!');
  };

  const filtradas = transacciones.filter(tx => 
    tx.referencia?.toLowerCase().includes(filtro.toLowerCase()) || 
    tx.id.toLowerCase().includes(filtro.toLowerCase()) ||
    tx.monto.toString().includes(filtro)
  );

  if (isLoading) return <div className="p-10 text-slate-500 animate-pulse">Cargando base de datos...</div>;

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Historial de Transacciones</h1>
          <p className="text-slate-500 text-sm mt-1">Registro completo de todos los pagos procesados.</p>
        </div>
        <button 
          onClick={exportarExcel}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold transition-colors shadow-sm text-sm"
        >
          <Download size={16} /> Exportar Todo
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center">
          <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-slate-200 w-full max-w-md focus-within:border-blue-500 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Filtrar por referencia o monto..." 
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full text-slate-700"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4 pl-6">ID de Operación</th>
                <th className="p-4">Método</th>
                <th className="p-4">Referencia</th>
                <th className="p-4">Monto</th>
                <th className="p-4">Fecha</th>
                <th className="p-4 pr-6">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtradas.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No se encontraron pagos.</td></tr>
              ) : (
                filtradas.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-400 truncate max-w-[120px]">{tx.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-700 capitalize">{tx.metodo.replace('_', ' ')}</td>
                    <td className="p-4 text-sm text-slate-600">{tx.referencia || 'N/A'}</td>
                    <td className="p-4 text-sm font-bold text-slate-900">${Number(tx.monto).toFixed(2)}</td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <CheckCircle2 size={12} /> Completado
                      </span>
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