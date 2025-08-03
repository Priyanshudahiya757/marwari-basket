import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import { toast } from 'react-hot-toast';

function OrderDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrder();
  }, [id, user, navigate]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderAPI.getOrderById(id);
      setOrder(response.data);
      } catch (err) {
      console.error('Failed to load order:', err);
      setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderAPI.cancelOrder(id);
      toast.success('Order cancelled successfully!');
      loadOrder(); // Reload order
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const handleRequestReturn = async () => {
    const reason = prompt('Please enter the reason for return:');
    if (!reason) return;
    
    try {
      await orderAPI.requestReturn(id, { reason });
      toast.success('Return request submitted successfully!');
      loadOrder(); // Reload order
    } catch (error) {
      console.error('Failed to request return:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '⚙️';
      case 'shipped': return '📦';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      case 'returned': return '🔄';
      default: return '📋';
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending': return 'Your order is being processed';
      case 'processing': return 'Your order is being prepared for shipping';
      case 'shipped': return 'Your order is on its way to you';
      case 'delivered': return 'Your order has been delivered successfully';
      case 'cancelled': return 'Your order has been cancelled';
      case 'returned': return 'Your order has been returned';
      default: return 'Order status unknown';
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading order details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
          <div className="text-center mt-4">
            <Link 
              to="/orders" 
              className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition shadow"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!order) return null;

  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-neutral-900">Order Details</h1>
            <p className="text-gray-600 mt-2">
              Order #{order._id.slice(-6).toUpperCase()}
            </p>
          </div>
          <Link 
            to="/orders" 
            className="bg-gray-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-700 transition shadow"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">{getStatusIcon(order.orderStatus)}</span>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Order Status</h2>
                  <p className="text-gray-600">{getStatusDescription(order.orderStatus)}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.name || item.product?.name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-500 text-xl">📦</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-800">
                        {item.name || item.product?.name || 'Product'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ₹{item.price?.toLocaleString()}
                      </p>
                      {item.sku && (
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-800">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Order Actions</h2>
              <div className="flex gap-4">
                {order.orderStatus === 'pending' && (
                  <button 
                    onClick={handleCancelOrder}
                    className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition shadow"
                  >
                    Cancel Order
                  </button>
                )}
                
                {order.orderStatus === 'delivered' && (
                  <button 
                    onClick={handleRequestReturn}
                    className="bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition shadow"
                  >
                    Request Return
                  </button>
                )}
                
                {order.trackingUrl && (
                  <a 
                    href={order.trackingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow"
                  >
                    Track Package
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Time:</span>
                  <span className="font-semibold">
                    {new Date(order.createdAt).toLocaleTimeString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold capitalize">
                    {order.payment?.method || 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-semibold capitalize ${
                    order.payment?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.payment?.status || 'Pending'}
                  </span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">
                    ₹{(order.totalAmount - (order.deliveryCharge || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge:</span>
                  <span className="font-semibold">
                    ₹{(order.deliveryCharge || 0).toLocaleString()}
                  </span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-neutral-900">Total:</span>
                  <span className="font-bold text-pink-600">
                    ₹{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Shipping Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-neutral-800">{order.shippingAddress?.name}</p>
                  <p className="text-gray-600">{order.shippingAddress?.phone}</p>
                </div>
                <div className="text-gray-600">
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                  <p>Pincode: {order.shippingAddress?.pincode}</p>
                </div>
                {order.trackingNumber && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="font-semibold text-neutral-800">Tracking Number:</p>
                    <p className="text-gray-600 font-mono">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Status History</h2>
                <div className="space-y-3">
                  {order.statusHistory.map((status, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-neutral-800 capitalize">{status.status}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(status.date).toLocaleDateString('en-IN')} at{' '}
                          {new Date(status.date).toLocaleTimeString('en-IN')}
                        </p>
                        {status.note && (
                          <p className="text-sm text-gray-500 mt-1">{status.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderDetail; 