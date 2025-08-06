import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Products', to: '/products' },
  { name: 'Offers', to: '/offers' },
  { name: 'Contact', to: '/contact' },
];

// Helper: decode JWT (naive, for demo)
function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.warn('Failed to decode JWT token:', error);
    return null;
  }
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Track login state and user
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(getUserFromToken());
  
  useEffect(() => {
    const handleStorage = () => {
      setLoggedIn(!!localStorage.getItem('token'));
      setUser(getUserFromToken());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logout handler with loading state
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Clear token and user data
      localStorage.removeItem('token');
      setLoggedIn(false);
      setUser(null);
      setDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Secret admin logo click logic
  const [logoClicks, setLogoClicks] = useState(0);
  const logoClickTimeout = useRef(null);

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      if (prev === 0) {
        // Start/reset timer on first click
        if (logoClickTimeout.current) clearTimeout(logoClickTimeout.current);
        logoClickTimeout.current = setTimeout(() => setLogoClicks(0), 3000);
      }
      const next = prev + 1;
      if (next === 5) {
        navigate('/admin');
        setTimeout(() => setLogoClicks(0), 100); // Reset after navigation
        return 0;
      }
      return next;
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-neutral-200 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className="font-extrabold text-2xl md:text-3xl bg-gradient-to-r from-pink-600 via-yellow-400 to-orange-600 bg-clip-text text-transparent font-serif tracking-tight select-none">
          Marwari Basket
        </Link>
        
        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-8 items-center font-medium text-lg">
          {navLinks.map(link => (
            <li key={link.name}>
              <Link
                to={link.to}
                className={`relative transition-colors duration-200 hover:text-pink-600 ${location.pathname === link.to ? 'text-pink-600 font-bold' : 'text-neutral-800'}`}
              >
                {link.name}
                <span className={`block h-0.5 bg-pink-500 transition-all duration-300 ${location.pathname === link.to ? 'w-full' : 'w-0'} absolute left-0 -bottom-1`}></span>
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Desktop Cart Icon */}
        <Link to="/cart" className="relative hidden md:block ml-4">
          <span className="bg-pink-600 text-white rounded-xl px-3 py-2 text-xl shadow hover:bg-pink-700 transition-all cursor-pointer">
            🛒
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-neutral-900 text-xs rounded-full px-2 py-0.5 font-bold border border-white">
              {cartCount}
            </span>
          )}
        </Link>
        
        {/* Desktop Auth Buttons / User Dropdown */}
        <div className="hidden md:flex ml-4 items-center gap-2 relative" ref={dropdownRef}>
          {!loggedIn ? (
            <Link to="/login" className="bg-white border border-pink-600 text-pink-600 px-4 py-2 rounded-full font-semibold shadow hover:bg-pink-50 transition">
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(v => !v)}
                disabled={isLoading}
                className="flex items-center gap-2 bg-white border border-pink-600 text-pink-600 px-4 py-2 rounded-full font-semibold shadow hover:bg-pink-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-bold">{user?.name || user?.email || 'User'}</span>
                <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
                  <Link to="/my-account" className="block px-4 py-2 hover:bg-pink-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      My Account
                    </div>
                  </Link>
                  <Link to="/my-orders" className="block px-4 py-2 hover:bg-pink-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📦</span>
                      My Orders
                    </div>
                  </Link>
                  <div className="border-t border-neutral-200"></div>
                  <button 
                    onClick={handleLogout} 
                    disabled={isLoading}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚪</span>
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button - Only show on mobile */}
        <button
          className="md:hidden ml-4 text-3xl text-neutral-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>
      
      {/* Mobile Nav - Only show on mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-neutral-200 shadow-lg px-6 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.to}
              className={`py-2 text-lg font-semibold rounded transition-colors duration-200 ${location.pathname === link.to ? 'text-pink-600' : 'text-neutral-800'} hover:bg-pink-50`}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/cart" className="flex items-center gap-2 mt-2 text-pink-600 font-bold" onClick={() => setMenuOpen(false)}>
            <span className="bg-pink-600 text-white rounded-xl px-3 py-2 text-xl shadow">🛒</span>
            Cart
            {cartCount > 0 && (
              <span className="ml-1 bg-yellow-400 text-neutral-900 text-xs rounded-full px-2 py-0.5 font-bold border border-white">
                {cartCount}
              </span>
            )}
          </Link>
          {!loggedIn ? (
            <Link to="/login" className="bg-white border border-pink-600 text-pink-600 px-4 py-2 rounded-full font-semibold shadow hover:bg-pink-50 transition" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          ) : (
            <>
              <Link to="/my-account" className="block px-4 py-2 hover:bg-pink-50 transition-colors" onClick={() => setMenuOpen(false)}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  My Account
                </div>
              </Link>
              <Link to="/my-orders" className="block px-4 py-2 hover:bg-pink-50 transition-colors" onClick={() => setMenuOpen(false)}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📦</span>
                  My Orders
                </div>
              </Link>
              <button 
                onClick={() => { handleLogout(); setMenuOpen(false); }} 
                disabled={isLoading}
                className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚪</span>
                  {isLoading ? 'Logging out...' : 'Logout'}
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
} 