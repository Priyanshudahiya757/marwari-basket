import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { orderAPI } from '../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Skeleton from '../components/Skeleton';

export default function MyOrders() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderAPI.cancelOrder(orderId);
      toast.success('Order cancelled successfully!');
      loadOrders(); // Reload orders
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const handleRequestReturn = async (orderId) => {
    const reason = prompt('Please enter the reason for return:');
    if (!reason) return;
    
    try {
      await orderAPI.requestReturn(orderId, { reason });
      toast.success('Return request submitted successfully!');
      loadOrders(); // Reload orders
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

  if (!user) return null;

  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8 text-neutral-900">My Orders</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-neutral-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your order history here!</p>
            <Link 
              to="/products" 
              className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition shadow"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-4 mb-2 sm:mb-0">
                    <span className="text-2xl">{getStatusIcon(order.orderStatus)}</span>
                    <div>
                      <h3 className="font-bold text-neutral-900">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-neutral-800 mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {item.product?.images?.[0] ? (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.name || item.product?.name} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-gray-500 text-lg">📦</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-800">
                              {item.name || item.product?.name || 'Product'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-neutral-800">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="font-semibold text-neutral-800">Shipping Address:</p>
                    <p className="text-gray-600">
                      {order.shippingAddress?.name}<br />
                      {order.shippingAddress?.address}<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">Payment:</p>
                    <p className="text-gray-600 capitalize">
                      {order.payment?.method || 'Not specified'}
                    </p>
                    {order.trackingNumber && (
                      <>
                        <p className="font-semibold text-neutral-800 mt-2">Tracking:</p>
                        <p className="text-gray-600">{order.trackingNumber}</p>
                        {order.trackingUrl && (
                          <a 
                            href={order.trackingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-800 text-sm underline"
                          >
                            Track Package
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center py-3 border-t border-gray-200">
                  <div>
                    <p className="font-semibold text-neutral-800">Total Amount:</p>
                    <p className="text-2xl font-bold text-pink-600">
                      ₹{order.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      to={`/order/${order._id}`}
                      className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition shadow"
                    >
                      View Details
                    </Link>
                    
                    {order.orderStatus === 'pending' && (
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition shadow"
                      >
                        Cancel Order
                      </button>
                    )}
                    
                    {order.orderStatus === 'delivered' && (
                      <button 
                        onClick={() => handleRequestReturn(order._id)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-700 transition shadow"
                      >
                        Request Return
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 