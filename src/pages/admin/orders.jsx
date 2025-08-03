import React, { useState, useEffect } from 'react';
import OrderList from '../../components/admin/Orders/OrderList';
import OrderDetail from '../../components/admin/Orders/OrderDetail';
import Sidebar from '../../components/admin/Sidebar';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleBulkAction = async (action, orderIds, additionalData = null) => {
    try {
      const body = { action, orderIds };
      if (additionalData) {
        Object.assign(body, additionalData);
      }

      const response = await fetch('/api/admin/orders/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 via-white to-pink-50 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-serif font-bold text-neutral-900">Order Management</h1>
                <p className="text-sm text-gray-500">Manage customer orders and fulfillment</p>
              </div>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Export Orders
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700">
                  Bulk Fulfill
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto admin-scrollbar">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-8">
            <OrderList
              orders={orders}
              onView={handleViewOrder}
              onUpdateStatus={handleUpdateStatus}
              onBulkAction={handleBulkAction}
            />
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {showDetail && selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={handleCloseDetail}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
} 