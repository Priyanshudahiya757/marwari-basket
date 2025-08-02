import React, { useState } from 'react';

export default function OrderDetail({ order, onClose, onUpdateStatus }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(order?.status || '');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800'
  };

  const statusTimeline = [
    { status: 'pending', label: 'Order Placed', icon: '📝' },
    { status: 'confirmed', label: 'Order Confirmed', icon: '✅' },
    { status: 'processing', label: 'Processing', icon: '⚙️' },
    { status: 'shipped', label: 'Shipped', icon: '📦' },
    { status: 'delivered', label: 'Delivered', icon: '🎉' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentStatusIndex = () => {
    return statusTimeline.findIndex(item => item.status === order?.status);
  };

  const handleStatusUpdate = () => {
    onUpdateStatus(order._id, newStatus);
    setIsEditing(false);
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Order Status</h3>
              <div className="flex items-center space-x-4">
                {statusTimeline.map((item, index) => {
                  const isCompleted = index <= getCurrentStatusIndex();
                  const isCurrent = item.status === order.status;
                  
                  return (
                    <div key={item.status} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                        isCompleted ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="ml-2">
                        <div className={`text-sm font-medium ${
                          isCurrent ? 'text-yellow-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {item.label}
                        </div>
                      </div>
                      {index < statusTimeline.length - 1 && (
                        <div className={`w-8 h-0.5 mx-2 ${
                          isCompleted ? 'bg-yellow-600' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Status Update */}
              <div className="mt-4 flex items-center space-x-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border rounded-lg">
              <div className="px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">Order Items</h3>
              </div>
              <div className="divide-y">
                {order.items?.map((item, index) => (
                  <div key={index} className="p-4 flex items-center space-x-4">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white border rounded-lg">
              <div className="px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">Shipping Information</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.street}<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                      {order.shippingAddress?.country}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <p className="text-sm text-gray-600">
                      Phone: {order.shippingAddress?.phone}<br />
                      Email: {order.customer?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                    {order.paymentStatus?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>₹{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>₹{order.shippingCost?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>₹{order.tax?.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>₹{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700">
                  Print Invoice
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700">
                  Generate Shipping Label
                </button>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded text-sm hover:bg-purple-700">
                  Send Email Update
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded text-sm hover:bg-gray-700">
                  Process Return
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 