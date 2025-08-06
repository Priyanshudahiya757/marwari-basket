import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';

export default function BottomNav() {
  const location = useLocation();
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Debug logging
  useEffect(() => {
    console.log('🔍 BottomNav component loaded');
    console.log('📍 Current location:', location.pathname);
    console.log('📱 Screen width:', window.innerWidth);
  }, [location.pathname]);

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
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] bg-red-500 border-t-4 border-blue-500 shadow-2xl md:hidden" style={{height: '80px'}}>
      <div className="flex items-center justify-around px-2 py-3 h-full">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-yellow-300 text-black scale-110'
                  : 'text-white hover:text-yellow-300 hover:bg-red-600'
              }`}
            >
              <div className="relative">
                <span className="text-2xl">{active ? item.activeIcon : item.icon}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border border-white">
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