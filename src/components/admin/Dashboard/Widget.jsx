import React from 'react';

export default function Widget({ title, value, icon, color = 'bg-yellow-100', children }) {
  return (
    <div className={`rounded-xl shadow flex flex-col items-center p-6 ${color} min-w-[180px] min-h-[120px]`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 font-semibold mb-2">{title}</div>
      {children}
    </div>
  );
} 