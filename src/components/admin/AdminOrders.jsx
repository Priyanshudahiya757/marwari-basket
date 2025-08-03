import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const statusOptions = ['pending', 'shipped', 'delivered'];

function AdminOrders() {
  const { token } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    }
    if (token) load();
  }, [token]);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const res = await api.put(`/api/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
      toast.success('Order status updated!');
    } catch (err) {
      // Error handled by Axios interceptor
    } finally {
      setUpdating('');
    }
  };

  if (loading) return <div className="text-center py-10 text-lg text-pink-600">Loading orders...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-100">
      <h2 className="text-2xl font-serif font-bold mb-8 text-neutral-900">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full mb-6 text-sm">
          <thead>
            <tr className="border-b bg-yellow-50">
              <th className="text-left py-3 px-2 font-semibold text-neutral-700">Order ID</th>
              <th className="text-center py-3 px-2 font-semibold text-neutral-700">User</th>
              <th className="text-center py-3 px-2 font-semibold text-neutral-700">Date</th>
              <th className="text-center py-3 px-2 font-semibold text-neutral-700">Total</th>
              <th className="text-center py-3 px-2 font-semibold text-neutral-700">Status</th>
              <th className="text-center py-3 px-2 font-semibold text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-yellow-50/50">
                <td className="py-3 px-2 font-mono">{order._id.slice(-6).toUpperCase()}</td>
                <td className="text-center">{order.user?.name || 'User'}</td>
                <td className="text-center">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="text-center text-pink-600 font-bold">₹{order.totalAmount}</td>
                <td className="text-center capitalize font-semibold">{order.orderStatus}</td>
                <td className="text-center">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border-2 border-yellow-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                    disabled={updating === order._id}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders; 