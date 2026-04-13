import React from 'react';

export default function LogoLumina({ width = 36, height = 36, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* ISOTIPO (El símbolo de cristales) */}
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Pilar vertical trasero */}
        <rect x="20" y="15" width="24" height="70" rx="12" fill="#94A3B8" opacity="0.4"/>
        {/* Base horizontal delantera (Azul brillante) */}
        <rect x="20" y="61" width="65" height="24" rx="12" fill="#3B82F6" opacity="0.9"/>
        {/* Destello de luz central */}
        <rect x="20" y="61" width="24" height="24" rx="10" fill="#60A5FA" opacity="0.7"/>
        {/* Punto de conexión */}
        <circle cx="73" cy="73" r="4" fill="#FFFFFF" />
      </svg>

      {/* LOGOTIPO (Texto adaptado para fondo oscuro) */}
      <span className="text-2xl font-extrabold tracking-tight text-white">
        Lumi<span className="text-blue-500">na</span>
      </span>
    </div>
  );
}