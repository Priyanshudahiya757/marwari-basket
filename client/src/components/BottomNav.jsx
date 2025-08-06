import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HomeIcon, TagIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/solid';

export default function BottomNav() {
  const location = useLocation();
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: HomeIcon,
    },
    {
      name: 'Products',
      path: '/products',
      icon: TagIcon,
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: ShoppingCartIcon,
      badge: cartCount,
    },
    {
      name: 'Account',
      path: '/my-account',
      icon: UserIcon,
    },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md border-t flex justify-around py-3 md:hidden">
      {navItems.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl min-w-[48px] min-h-[48px] transition-all duration-150 ${
              active ? 'text-orange-600 bg-orange-50 font-semibold' : 'text-gray-500 hover:text-orange-500'
            }`}
            style={{ fontSize: '14px' }}
          >
            <div className="relative flex items-center justify-center">
              <Icon className={`w-6 h-6 ${active ? 'fill-orange-600' : 'fill-none stroke-2'}`} />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border border-white">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-0.5">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
} 