import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyAccount from './pages/MyAccount';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  console.log('🚀 App component loaded');
  console.log('📱 Screen width:', window.innerWidth);
  console.log('📱 Is mobile:', window.innerWidth <= 768);

  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex-grow pt-16 pb-20 md:pb-0">
              <div className="container">
                <section className="section">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/my-account" element={<MyAccount />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/order/:id" element={<OrderDetail />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </section>
              </div>
            </main>
            <Footer />
            <BottomNav />
          </div>
          <Toaster position="top-right" />
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
