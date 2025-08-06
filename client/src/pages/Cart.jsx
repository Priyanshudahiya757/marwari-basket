import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + (item.price && typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, '')) : item.price || 0) * (item.quantity || item.qty || 1), 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  return (
    <main className="pt-16 pb-20 md:pb-0 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans">
      <section className="max-w-3xl mx-auto px-4 py-6 md:py-12">
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8 text-neutral-900">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-neutral-700 mb-2">Your cart is empty</h2>
            <p className="text-neutral-500 mb-6">Add some products to get started!</p>
            <Link 
              to="/products" 
              className="inline-block bg-gradient-to-r from-pink-600 to-yellow-400 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item, idx) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center bg-white rounded-xl shadow-sm border p-4 gap-3 hover:shadow-md transition-all"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border-2 border-yellow-200 flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-sm md:text-lg text-neutral-900 font-serif truncate">{item.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs md:text-sm text-neutral-500">Qty:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item._id || item.id, (item.quantity || item.qty || 1) - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-medium">
                          {item.quantity || item.qty || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id || item.id, (item.quantity || item.qty || 1) + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-lg md:text-xl font-bold text-pink-600 mt-1">
                      ₹{(item.price && typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, '')) : item.price || 0) * (item.quantity || item.qty || 1)}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item._id || item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-4 md:p-6 mb-6 border-2 border-yellow-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-neutral-900">Total:</span>
                <span className="text-2xl font-bold text-pink-600">₹{total.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link 
                to="/products" 
                className="w-full bg-white border-2 border-pink-600 text-pink-600 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg text-center hover:bg-pink-50 transition shadow"
              >
                Continue Shopping
              </Link>
              <Link 
                to="/checkout" 
                className="w-full bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg text-center hover:scale-105 transition shadow"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
} 