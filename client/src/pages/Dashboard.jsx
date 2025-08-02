import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    sales: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const [productsRes, ordersRes, customersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/customers", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const sales = ordersRes.data.reduce((sum, order) => sum + (order.total || 0), 0);
        setStats({
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          customers: customersRes.data.length,
          sales
        });
      } catch (err) {
        // handle error (e.g., unauthorized)
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Products" value={stats.products} color="bg-blue-100 text-blue-700" />
        <StatCard label="Orders" value={stats.orders} color="bg-green-100 text-green-700" />
        <StatCard label="Customers" value={stats.customers} color="bg-yellow-100 text-yellow-700" />
        <StatCard label="Total Sales" value={`₹${stats.sales}`} color="bg-purple-100 text-purple-700" />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-lg p-6 shadow-sm ${color} flex flex-col items-center`}>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-md font-medium">{label}</div>
    </div>
  );
} 