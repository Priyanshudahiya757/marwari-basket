import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + (item.price && typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, '')) : item.price || 0) * (item.quantity || item.qty || 1), 0);

  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans">
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8 text-neutral-900">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-6">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start shopping to add products to your cart</p>
            <Link 
              to="/products" 
              className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white px-6 py-3 rounded-full font-semibold text-lg hover:scale-105 transition shadow"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {cart.map((item, idx) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center bg-white rounded-2xl shadow p-4 gap-4 hover:-translate-y-2 transition-all"
                >
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border-2 border-yellow-200" />
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-neutral-900 font-serif">{item.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-neutral-500">Qty:</span>
                      <input type="number" min="1" value={item.quantity || item.qty || 1} className="w-16 px-2 py-1 border-2 border-yellow-200 rounded" readOnly />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-pink-600">₹{(item.price && typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, '')) : item.price || 0) * (item.quantity || item.qty || 1)}</div>
                  <button 
                    className="ml-4 text-red-500 hover:underline"
                    onClick={() => removeFromCart(item._id || item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center bg-yellow-50 rounded-2xl p-6 mb-6 border-2 border-yellow-200">
              <span className="font-bold text-lg text-neutral-900">Total:</span>
              <span className="text-2xl font-bold text-pink-600">₹{total}</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Link to="/products" className="flex-1 bg-white border-2 border-pink-600 text-pink-600 py-3 rounded-full font-semibold text-lg text-center hover:bg-pink-50 transition shadow">Continue Shopping</Link>
              <Link to="/checkout" className="flex-1 bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 rounded-full font-semibold text-lg text-center hover:scale-105 transition shadow">Checkout</Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
} 