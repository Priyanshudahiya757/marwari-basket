import { useEffect, useState } from "react";
import axios from "axios";

const statusOptions = ["pending", "processing", "shipped", "delivered"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/api/orders", { headers });
    setOrders(res.data);
    setLoading(false);
  }

  async function handleStatusChange(orderId, newStatus) {
    setLoading(true);
    await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, { headers });
    fetchOrders();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Order List</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Order ID</th>
                  <th className="p-2 text-left">Customer</th>
                  <th className="p-2 text-left">Products</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-2 font-mono">{order._id.slice(-6)}</td>
                    <td className="p-2">
                      {order.customer ? (
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-xs text-gray-500">{order.customer.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="p-2">
                      <ul className="list-disc pl-4">
                        {order.products.map((item, i) => (
                          <li key={i}>
                            {item.product ? item.product.name : "[Deleted]"} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2">₹{order.total}</td>
                    <td className="p-2">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 