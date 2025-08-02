import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import Lenis from 'lenis';

function LenisProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LenisProvider>
      <UserProvider>
        <CartProvider>
          <Toaster position="top-center" />
          <App />
        </CartProvider>
      </UserProvider>
    </LenisProvider>
  </React.StrictMode>
);
