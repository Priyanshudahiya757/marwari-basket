import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyAccount from './pages/MyAccount';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminDashboardNew from './pages/admin/index';
import AdminProductsPage from './pages/admin/products';
import AdminOrdersPage from './pages/admin/orders';
import AdminCustomersPage from './pages/admin/customers';
import AdminSettingsPage from './pages/admin/settings';
import AdminHelpPage from './pages/admin/help';
import Contact from './pages/Contact';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import './index.css';
import './components/admin/admin-panel.css'; // Import admin panel styles
import ForgotPassword from './pages/ForgotPassword';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import BackToTop from './components/BackToTop';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './utils/mockApi'; // Import mock API for development
import AdminLogin from './pages/admin/login';

function KonamiCode() {
  const navigate = useNavigate();
  const sequence = useMemo(() => ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], []);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === sequence[currentIndex]) {
        setCurrentIndex((prev) => prev + 1);
        if (currentIndex + 1 === sequence.length) {
          navigate('/admin/login'); // Go to admin login page, not dashboard
          setCurrentIndex(0);
        }
      } else {
        setCurrentIndex(0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex, navigate, sequence]);

  return null;
}

export default function App() {
  return (
    <Router>
      <KonamiCode />
      <Navbar />
      <main className="pt-20">
      <Routes>
          {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          
          {/* User Account Routes */}
        <Route path="/account" element={<MyAccount />} />
        <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          
        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminDashboardNew />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/customers" element={<AdminCustomersPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/help" element={<AdminHelpPage />} />
          
          {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
      <Footer />
      <BackToTop />
    </Router>
  );
}
