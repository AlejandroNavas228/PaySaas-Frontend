import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4 animate-in fade-in duration-500">
      <div className="relative">
        {/* Anillo exterior decorativo */}
        <div className="w-12 h-12 rounded-full border-4 border-slate-100"></div>
        {/* Spinner real */}
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
      </div>
      <p className="text-slate-400 text-sm font-bold tracking-widest uppercase animate-pulse">
        Cargando Lumina...
      </p>
    </div>
  );
}