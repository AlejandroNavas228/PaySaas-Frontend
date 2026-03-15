import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams} from 'react-router-dom';
import toast from 'react-hot-toast'; // Importamos toast para los mensajes
import * as XLSX from 'xlsx'; // 1. Importamos la magia de Excel
import { 
  TrendingUp, 
  CreditCard, 
  CheckCircle2, 
  Download, 
  ArrowUpRight,
  Wallet,
  Smartphone
} from 'lucide-react';

export default function Dashboard() {
  const [transacciones, setTransacciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const terminoBusqueda = searchParams.get('buscar') || '';

  // MAGIA: Filtramos las transacciones en tiempo real
  const transaccionesFiltradas = transacciones.filter((tx) => {
    if (!terminoBusqueda) return true; // Si no hay búsqueda, mostramos todo
    
    const termino = terminoBusqueda.toLowerCase();
    const referencia = tx.referencia ? tx.referencia.toLowerCase() : '';
    const id = tx.id.toLowerCase();
    const monto = tx.monto.toString();

    // Buscamos si el texto coincide con la referencia, el ID o el monto exacto
    return referencia.includes(termino) || id.includes(termino) || monto.includes(termino);
  });

 useEffect(() => {
    const obtenerHistorial = async () => {
      const comercioId = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token'); // 1. Buscamos el brazalete

      // 2. Si falta el ID o falta el Token, lo sacamos al Login
      if (!comercioId || !token) {
        navigate('/login');
        return;
      }

      try {
        // 3. Hacemos la petición MOSTRANDO EL BRAZALETE en los Headers
        const response = await fetch(`https://lumina-backend-3pu1.onrender.com/api/pagos/${comercioId}`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTransacciones(data);
        } else {
          // Si el token expiró o es falso, el backend dará error y lo mandamos a login
          localStorage.clear(); 
          navigate('/login');
        }
      } catch (error) {
        console.error('Error de conexión:', error);
      } finally {
        setIsLoading(false);
      }
    };
    obtenerHistorial();
  }, [navigate]);

  // --- 2. NUEVA FUNCIÓN: EL MOTOR DE EXCEL ---
  const handleExportarExcel = () => {
    if (transacciones.length === 0) {
      toast.error('No hay datos para exportar aún.');
      return;
    }

    // A. Formateamos los datos para que las columnas se vean profesionales
    const datosLimpios = transacciones.map(tx => ({
      'Referencia / ID': tx.referencia || tx.id.substring(0, 8),
      'Fecha': new Date(tx.fecha).toLocaleDateString('es-VE'),
      'Hora': new Date(tx.fecha).toLocaleTimeString('es-VE'),
      'Método de Pago': tx.metodo === 'pago_movil' ? 'Pago Móvil' : 'Tarjeta',
      'Moneda': tx.moneda,
      'Monto': Number(tx.monto).toFixed(2),
      'Estado': tx.estado.toUpperCase()
    }));

    // B. Creamos el libro y la hoja de cálculo
    const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosLimpios);
    const libroDeTrabajo = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, "Ingresos");

    // C. Descargamos el archivo con la fecha actual en el nombre
    const nombreArchivo = `Reporte_Lumina_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(libroDeTrabajo, nombreArchivo);
    
    toast.success('¡Reporte de Excel descargado!');
  };

  const volumenTotal = transacciones.reduce((acc, tx) => acc + Number(tx.monto), 0);
  const totalOperaciones = transacciones.length;
  
  const formatearFecha = (fechaString) => {
    const opciones = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-VE', opciones);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Resumen de Actividad
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitorea tus ingresos y transacciones en tiempo real.
          </p>
        </div>
        
        {/* 3. CONECTAMOS LA FUNCIÓN AL BOTÓN */}
        <button 
          onClick={handleExportarExcel}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <Download size={16} />
          Exportar Excel
        </button>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
              <Wallet className="text-blue-600 group-hover:text-white transition-colors" size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <ArrowUpRight size={14} /> +12.5%
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Volumen Total (USD)</p>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            ${volumenTotal.toFixed(2)}
          </h3>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
              <CreditCard className="text-indigo-600 group-hover:text-white transition-colors" size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              Hoy
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Operaciones Exitosas</p>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {totalOperaciones}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
              <TrendingUp className="text-emerald-600 group-hover:text-white transition-colors" size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              Óptimo
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Tasa de Conversión</p>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            100%
          </h3>
        </div>
      </div>

      {/* TABLA DE TRANSACCIONES */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-bold text-slate-800">Historial Reciente</h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Ver todas &rarr;
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : transacciones.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <CreditCard className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-600 font-bold text-lg">Sin movimientos aún</p>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                Cuando tus clientes realicen pagos, aparecerán aquí de forma automática.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Detalle del Pago</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {transaccionesFiltradas.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {tx.metodo === 'pago_movil' ? <Smartphone size={18} /> : <CreditCard size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 capitalize text-sm">
                            {tx.metodo.replace('_', ' ')}
                          </p>
                          <p className="text-xs font-mono text-slate-400 mt-0.5">
                            Ref: {tx.referencia ? `#${tx.referencia}` : tx.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-slate-800">
                        {tx.moneda === 'USD' ? '$' : 'Bs.'} {Number(tx.monto).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">USD</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-600">{formatearFecha(tx.fecha)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50 w-fit">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-xs font-bold tracking-wide uppercase">Aprobado</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}