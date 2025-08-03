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
          <div className="text-center text-neutral-500 mb-8">Your cart is empty.</div>
        ) : (
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
        )}
        <div className="flex justify-between items-center bg-yellow-50 rounded-2xl p-6 mb-6 border-2 border-yellow-200">
          <span className="font-bold text-lg text-neutral-900">Total:</span>
          <span className="text-2xl font-bold text-pink-600">₹{total}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Link to="/products" className="flex-1 bg-white border-2 border-pink-600 text-pink-600 py-3 rounded-full font-semibold text-lg text-center hover:bg-pink-50 transition shadow">Continue Shopping</Link>
          <Link to="/checkout" className="flex-1 bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 rounded-full font-semibold text-lg text-center hover:scale-105 transition shadow">Checkout</Link>
        </div>
      </section>
    </main>
  );
} 