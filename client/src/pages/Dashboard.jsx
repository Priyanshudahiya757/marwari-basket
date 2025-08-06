import { useEffect, useState } from "react";
import { productAPI, orderAPI, adminAPI } from "../utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    sales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        console.log('📊 Fetching dashboard stats...');
        
        const [productsRes, ordersRes, customersRes] = await Promise.all([
          productAPI.getAll(),
          orderAPI.getAllOrders(),
          adminAPI.getAllUsers()
        ]);
        
        console.log('📊 API Responses:', {
          products: productsRes?.data,
          orders: ordersRes?.data,
          customers: customersRes?.data
        });
        
        // Safe handling of API responses
        const products = productsRes?.data || [];
        const orders = ordersRes?.data || [];
        const customers = customersRes?.data || [];
        
        // Ensure arrays and calculate sales safely
        const productsArray = Array.isArray(products) ? products : [];
        const ordersArray = Array.isArray(orders) ? orders : [];
        const customersArray = Array.isArray(customers) ? customers : [];
        
        const sales = ordersArray.reduce((sum, order) => {
          const orderTotal = order?.total || order?.totalAmount || 0;
          return sum + (typeof orderTotal === 'number' ? orderTotal : 0);
        }, 0);
        
        const newStats = {
          products: productsArray.length,
          orders: ordersArray.length,
          customers: customersArray.length,
          sales: sales
        };
        
        console.log('📊 Setting dashboard stats:', newStats);
        setStats(newStats);
      } catch (err) {
        console.error("❌ Failed to fetch dashboard stats:", err);
        // Set default values on error
        setStats({
          products: 0,
          orders: 0,
          customers: 0,
          sales: 0
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your fresh Marwari Basket store!</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Products" 
          value={stats.products} 
          color="bg-blue-50 border-blue-200" 
          textColor="text-blue-700"
          icon="📦"
        />
        <StatCard 
          label="Orders" 
          value={stats.orders} 
          color="bg-green-50 border-green-200" 
          textColor="text-green-700"
          icon="📋"
        />
        <StatCard 
          label="Customers" 
          value={stats.customers} 
          color="bg-yellow-50 border-yellow-200" 
          textColor="text-yellow-700"
          icon="👥"
        />
        <StatCard 
          label="Total Sales" 
          value={`₹${stats.sales.toLocaleString()}`} 
          color="bg-purple-50 border-purple-200" 
          textColor="text-purple-700"
          icon="💰"
        />
      </div>

      {stats.products === 0 && stats.orders === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Fresh Start!</h2>
          <p className="text-gray-600 mb-4">
            Your store is ready for launch. Start by adding products and welcoming your first customers.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Products
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              View Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, textColor, icon }) {
  return (
    <div className={`rounded-lg p-6 shadow-sm border ${color} flex flex-col items-center`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className={`text-3xl font-bold mb-2 ${textColor}`}>{value}</div>
      <div className="text-md font-medium text-gray-600">{label}</div>
    </div>
  );
} 