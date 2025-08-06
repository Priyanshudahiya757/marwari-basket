import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function BottomNav() {
  const location = useLocation();
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: '🏠',
      activeIcon: '🏠'
    },
    {
      name: 'Products',
      path: '/products',
      icon: '🛍️',
      activeIcon: '🛍️'
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: '🛒',
      activeIcon: '🛒',
      badge: cartCount
    },
    {
      name: 'Account',
      path: '/my-account',
      icon: '👤',
      activeIcon: '👤'
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-pink-100 text-pink-600 scale-110'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              <div className="relative">
                <span className="text-2xl">{active ? item.activeIcon : item.icon}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border border-white">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 ${active ? 'font-bold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 