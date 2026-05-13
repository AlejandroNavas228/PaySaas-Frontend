import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import TransactionsTable from '../../components/ui/TransactionsTable';
import LoadingScreen from '../../components/ui/LoadingScreen';

// 💡 IMPORTAMOS NUESTRO CEREBRO (SERVICIO API)
import { api } from '../../services/api';

// 💡 1. EL GUARDIÁN DE LOS PLANES
const tienePermiso = (planUsuario, planRequerido) => {
  const niveles = { 'starter': 0, 'pro': 1, 'business': 2 };
  const nivelActual = niveles[planUsuario] || 0; 
  return nivelActual >= niveles[planRequerido];
};

export default function Transacciones() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [transacciones, setTransacciones] = useState([]);
  const [comercio, setComercio] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // 2. CARGA DE DATOS OPTIMIZADA CON EL SERVICIO API
  useEffect(() => {
    const cargarDatos = async () => {
      const comercioId = localStorage.getItem('comercioId');

      if (!comercioId) {
        navigate('/login');
        return;
      }

      try {
        // 💡 MAGIA: Promise.all ejecutando nuestras funciones abstractas
        const [dataPagos, dataComercio] = await Promise.all([
          api.obtenerTransacciones(comercioId),
          api.obtenerComercio(comercioId)
        ]);
        
        setTransacciones(dataPagos); 
        setComercio(dataComercio);
        
      } catch (error) {
        toast.error(error.message || 'Error al cargar el historial de transacciones');
      } finally {
        setTimeout(() => setCargando(false), 500);
      }
    };

    cargarDatos();
  }, [navigate]);

  // 3. LÓGICA DE FILTRADO (Se ejecuta en tiempo real)
  const transaccionesFiltradas = transacciones.filter(tx => {
    const coincideEstado = filtroEstado === 'todos' || tx.estado === filtroEstado;
    
    const textoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda = 
      (tx.referenciaComercio && tx.referenciaComercio.toLowerCase().includes(textoBusqueda)) ||
      (tx.descripcion && tx.descripcion.toLowerCase().includes(textoBusqueda)) ||
      (tx.id && tx.id.toLowerCase().includes(textoBusqueda));

    return coincideEstado && coincideBusqueda;
  });

  // 4. EXCEL PERFECTO (Intacto)
  const exportarAExcel = () => {
    if (!tienePermiso(comercio?.plan_actual, 'pro')) {
      return toast.error("Función exclusiva de los planes PRO y BUSINESS");
    }

    if (transaccionesFiltradas.length === 0) {
      return toast.error("No hay datos para exportar con estos filtros");
    }

    const encabezados = ["ID Transaccion", "Fecha y Hora", "Producto", "Monto (USD)", "Metodo", "Estado", "Referencia"];
    
    const filas = transaccionesFiltradas.map(tx => {
      const fechaLimpia = new Date(tx.fecha || tx.createdAt).toLocaleString();
      const descLimpia = tx.descripcion ? tx.descripcion.replace(/"/g, '""') : 'General';

      return [
        `"${tx.id}"`,
        `"${fechaLimpia}"`,
        `"${descLimpia}"`,
        `"${tx.monto}"`,
        `"${tx.metodo}"`,
        `"${tx.estado}"`,
        `"${tx.referenciaComercio || tx.id.substring(0,8)}"`
      ].join(";");
    });

    const contenidoCsv = "\uFEFF" + [encabezados.join(";"), ...filas].join("\n");
    
    const blob = new Blob([contenidoCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Lumina_Reporte_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("¡Reporte descargado con éxito!");
  };

  if (cargando) return <LoadingScreen />;

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-8">
      
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Historial de Transacciones</h1>
          <p className="text-slate-500 font-medium">Revisa y filtra todos los pagos de tu negocio.</p>
        </div>

        {/* BOTÓN DE EXCEL CONDICIONAL */}
        {tienePermiso(comercio?.plan_actual, 'pro') ? (
          <button 
            onClick={exportarAExcel} 
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-green-600/20 w-full md:w-auto"
          >
            <FileText size={20} /> Exportar Reporte
          </button>
        ) : (
          <div className="group relative w-full md:w-auto">
            <button 
              onClick={() => toast.error("Actualiza al Plan PRO para descargar reportes.")} 
              className="flex items-center justify-center gap-3 w-full bg-slate-100 text-slate-400 font-black py-4 px-8 rounded-2xl cursor-not-allowed transition-all"
            >
              <Lock size={18} /> Exportar Reporte
            </button>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Requiere Plan PRO o superior
            </span>
          </div>
        )}
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* BARRA DE FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          
          {/* Buscador de Texto */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por referencia o producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700"
            />
          </div>

          {/* Selector de Estado */}
          <div className="md:w-72 relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Filter size={20} className="text-slate-400" />
            </div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-10 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
            >
              <option value="todos">Todos los estados</option>
              <option value="aprobado">Aprobados</option>
              <option value="en_revision">En Revisión / Pendientes</option>
              <option value="rechazado">Rechazados</option>
            </select>
          </div>

        </div>

        {/* TABLA DE TRANSACCIONES */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <TransactionsTable 
            transacciones={transaccionesFiltradas} 
            setTransacciones={setTransacciones} 
          />
        </div>

      </div>
    </div>
  );
}