import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileText, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import TransactionsTable from '../../components/ui/TransactionsTable';

// 💡 1. EL GUARDIÁN DE LOS PLANES
const tienePermiso = (planUsuario, planRequerido) => {
  const niveles = { 'starter': 0, 'pro': 1, 'business': 2 };
  // Si por alguna razón no hay plan, asumimos starter (0)
  const nivelActual = niveles[planUsuario] || 0; 
  return nivelActual >= niveles[planRequerido];
};

export default function Transacciones() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [transacciones, setTransacciones] = useState([]);
  const [comercio, setComercio] = useState(null);

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

  // 3. LA MAGIA DE EXCEL (Solo funciona si eres Pro o Business)
  const exportarAExcel = () => {
    if (!tienePermiso(comercio?.plan_actual, 'pro')) {
      return toast.error("Función exclusiva de los planes PRO y BUSINESS");
    }

    if (transacciones.length === 0) {
      return toast.error("No hay transacciones para exportar");
    }

    // Cabeceras de Excel
    const encabezados = ["ID Transaccion", "Fecha y Hora", "Producto", "Monto (USD)", "Metodo", "Estado", "Referencia"];
    
    // Transformamos las transacciones a filas de texto
    const filas = transacciones.map(tx => {
      const fechaLimpia = new Date(tx.fecha || tx.createdAt).toLocaleString();
      return [
        tx.id,
        `"${fechaLimpia}"`,
        `"${tx.descripcion || 'General'}"`, // Comillas para evitar errores si el nombre tiene comas
        tx.monto,
        tx.metodo,
        tx.estado,
        tx.referenciaComercio || tx.id.substring(0,8)
      ].join(",");
    });

    // Unimos cabeceras y filas
    const contenidoCsv = [encabezados.join(","), ...filas].join("\n");
    
    // Forzamos la descarga del archivo en el navegador
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
      
      {/* ENCABEZADO Y BOTÓN DE EXCEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Historial de Transacciones</h1>
          <p className="text-slate-500 mt-1">Revisa todos los pagos procesados y pendientes de tu negocio.</p>
        </div>

        {/* 💡 RENDERIZADO CONDICIONAL DEL BOTÓN */}
        {tienePermiso(comercio?.plan_actual, 'pro') ? (
          <button 
            onClick={exportarAExcel} 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-green-600/20"
          >
            <FileText size={20} /> Exportar Reporte (.csv)
          </button>
        ) : (
          <div className="group relative">
            <button 
              onClick={() => toast.error("Actualiza al Plan PRO para descargar reportes.")} 
              className="flex items-center gap-2 bg-slate-200 text-slate-500 font-bold py-3 px-6 rounded-xl cursor-not-allowed transition-all"
            >
              <Lock size={18} /> Exportar Reporte
            </button>
            {/* Pequeño tooltip invitando a mejorar el plan */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Requiere Plan PRO o superior
            </span>
          </div>
        )}
      </div>

      {/* TABLA DE TRANSACCIONES */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Le pasamos todas las transacciones, no solo las 5 primeras */}
        <TransactionsTable transacciones={transacciones} />
      </div>

    </div>
  );
}