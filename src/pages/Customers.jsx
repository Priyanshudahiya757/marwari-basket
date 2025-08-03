import { useEffect, useState } from "react";
import axios from "axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/api/customers", { headers });
    setCustomers(res.data);
    setLoading(false);
  }

  async function handleView(customer) {
    setSelected(customer);
    setLoading(true);
    const res = await axios.get(`http://localhost:5000/api/customers/${customer._id}`, { headers });
    setOrderHistory(res.data.orders || []);
    setLoading(false);
  }

  function handleClose() {
    setSelected(null);
    setOrderHistory([]);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Customer List</h2>
        {loading && !selected ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">Address</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b">
                    <td className="p-2 font-medium">{customer.name}</td>
                    <td className="p-2">{customer.email}</td>
                    <td className="p-2">{customer.phone}</td>
                    <td className="p-2">{customer.address}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleView(customer)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal for customer details and order history */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
            <div className="mb-2 text-gray-700">
              <div><span className="font-medium">Email:</span> {selected.email}</div>
              <div><span className="font-medium">Phone:</span> {selected.phone}</div>
              <div><span className="font-medium">Address:</span> {selected.address}</div>
            </div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Order History</h3>
            {loading ? (
              <div>Loading...</div>
            ) : orderHistory.length === 0 ? (
              <div className="text-gray-500">No orders found.</div>
            ) : (
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {orderHistory.map((order) => (
                  <li key={order._id} className="border rounded p-2">
                    <div className="flex justify-between text-sm">
                      <span>Order #{order._id.slice(-6)}</span>
                      <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-gray-600">Status: {order.status}</div>
                    <div className="text-xs text-gray-600">Total: ₹{order.total}</div>
                    <ul className="list-disc pl-4 text-xs text-gray-500 mt-1">
                      {order.products.map((item, i) => (
                        <li key={i}>{item.product ? item.product.name : "[Deleted]"} x {item.quantity}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 