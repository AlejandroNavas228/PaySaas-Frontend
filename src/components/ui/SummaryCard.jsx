import React from 'react';

export default function SummaryCard({ title, amount, subtitle, colorClass }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${colorClass}`}>{amount}</p>
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
}