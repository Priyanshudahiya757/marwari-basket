import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const stats = [
  { label: 'Total Sales', value: '₹12,500' },
  { label: 'Orders', value: '120' },
  { label: 'Users', value: '85' },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans flex">
      {/* Sidebar */}
      <div className="md:hidden p-2">
        <button onClick={() => setSidebarOpen(true)} className="bg-pink-600 text-white px-4 py-2 rounded mb-4 shadow">☰ Menu</button>
      </div>
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-serif font-bold mb-10 text-neutral-900">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border-2 border-yellow-100"
            >
              <div className="text-3xl font-bold text-pink-600 mb-2">{stat.value}</div>
              <div className="text-neutral-700 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <button className="flex-1 bg-gradient-to-r from-yellow-400 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow hover:scale-105 transition">Manage Products</button>
          <button className="flex-1 bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-4 rounded-xl font-semibold text-lg shadow hover:scale-105 transition">Manage Orders</button>
        </div>
      </div>
    </main>
  );
} 