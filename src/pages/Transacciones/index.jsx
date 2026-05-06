import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock, Loader2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import TransactionsTable from '../../components/ui/TransactionsTable';

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

  // 💡 ESTADOS PARA LOS FILTROS
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // 2. CARGAMOS TODOS LOS DATOS
  useEffect(() => {
    const cargarDatos = async () => {
      const comercioId = localStorage.getItem('comercioId');
      const token = localStorage.getItem('token');

      if (!comercioId || !token) {
        navigate('/login');
        return;
      }

      try {
        const [resPagos, resComercio] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/pagos/${comercioId}`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/comercio/${comercioId}`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
          })
        ]);
        
        if (resPagos.ok && resComercio.ok) {
          const dataPagos = await resPagos.json();
          const dataComercio = await resComercio.json();
          setTransacciones(dataPagos); 
          setComercio(dataComercio);
        }
      } catch (error) {
        toast.error('Error al cargar el historial de transacciones');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  // 💡 3. LÓGICA DE FILTRADO (Se ejecuta en tiempo real)
  const transaccionesFiltradas = transacciones.filter(tx => {
    // Filtrar por estado
    const coincideEstado = filtroEstado === 'todos' || tx.estado === filtroEstado;
    
    // Filtrar por búsqueda (Referencia o Descripción)
    const textoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda = 
      (tx.referenciaComercio && tx.referenciaComercio.toLowerCase().includes(textoBusqueda)) ||
      (tx.descripcion && tx.descripcion.toLowerCase().includes(textoBusqueda)) ||
      (tx.id && tx.id.toLowerCase().includes(textoBusqueda));

    return coincideEstado && coincideBusqueda;
  });

  // 4. EXCEL PERFECTO (Para Excel en Español)
  const exportarAExcel = () => {
    if (!tienePermiso(comercio?.plan_actual, 'pro')) {
      return toast.error("Función exclusiva de los planes PRO y BUSINESS");
    }

    if (transaccionesFiltradas.length === 0) {
      return toast.error("No hay datos para exportar con estos filtros");
    }

    // Cabeceras de la tabla
    const encabezados = ["ID Transaccion", "Fecha y Hora", "Producto", "Monto (USD)", "Metodo", "Estado", "Referencia"];
    
    // Transformamos a filas usando PUNTO Y COMA (;) para Excel en español
    const filas = transaccionesFiltradas.map(tx => {
      const fechaLimpia = new Date(tx.fecha || tx.createdAt).toLocaleString();
      
      // Limpiamos la descripción de posibles comillas dobles que rompan el archivo
      const descLimpia = tx.descripcion ? tx.descripcion.replace(/"/g, '""') : 'General';

      return [
        `"${tx.id}"`,
        `"${fechaLimpia}"`,
        `"${descLimpia}"`,
        `"${tx.monto}"`,
        `"${tx.metodo}"`,
        `"${tx.estado}"`,
        `"${tx.referenciaComercio || tx.id.substring(0,8)}"`
      ].join(";"); // 👈 El separador clave
    });

    // 💡 El "\uFEFF" es la magia (BOM) que le dice a Excel que respete los acentos y las ñ
    const contenidoCsv = "\uFEFF" + [encabezados.join(";"), ...filas].join("\n");
    
    // Forzamos la descarga
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

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Historial de Transacciones</h1>
          <p className="text-slate-500 mt-1">Revisa y filtra todos los pagos de tu negocio.</p>
        </div>

        {/* BOTÓN DE EXCEL CONDICIONAL */}
        {tienePermiso(comercio?.plan_actual, 'pro') ? (
          <button 
            onClick={exportarAExcel} 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-green-600/20"
          >
            <FileText size={20} /> Exportar Reporte
          </button>
        ) : (
          <div className="group relative">
            <button 
              onClick={() => toast.error("Actualiza al Plan PRO para descargar reportes.")} 
              className="flex items-center gap-2 bg-slate-200 text-slate-500 font-bold py-3 px-6 rounded-xl cursor-not-allowed transition-all"
            >
              <Lock size={18} /> Exportar Reporte
            </button>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Requiere Plan PRO o superior
            </span>
          </div>
        )}
      </div>

      {/* 💡 BARRA DE FILTROS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
        
        {/* Buscador de Texto */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por referencia o producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm"
          />
        </div>

        {/* Selector de Estado */}
        <div className="md:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-slate-400" />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm appearance-none bg-white cursor-pointer"
          >
            <option value="todos">Todos los estados</option>
            <option value="aprobado">Aprobados</option>
            <option value="en_revision">En Revisión / Pendientes</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>

      </div>

      {/* TABLA DE TRANSACCIONES */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Le pasamos la lista FILTRADA, ya no la lista completa */}
        <TransactionsTable transacciones={transaccionesFiltradas} />
      </div>

    </div>
  );
}