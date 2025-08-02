import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSidebar({ open, setOpen }) {
  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/users', label: 'Users' },
  ];
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block w-56 bg-gray-900 text-white min-h-screen p-6">
        <div className="font-bold text-xl mb-8">Admin Panel</div>
        <nav className="flex flex-col gap-4">
          {links.map(link => (
            <Link key={link.to} to={link.to} className="hover:text-pink-400 transition">{link.label}</Link>
          ))}
        </nav>
      </div>
      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white shadow-lg flex flex-col gap-6 p-8 z-40 md:hidden"
          >
            <div className="font-bold text-xl mb-8">Admin Panel</div>
            <nav className="flex flex-col gap-4">
              {links.map(link => (
                <Link key={link.to} to={link.to} className="hover:text-pink-400 transition" onClick={() => setOpen(false)}>{link.label}</Link>
              ))}
            </nav>
            <button className="mt-auto text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Overlay for mobile drawer */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={() => setOpen(false)}></div>}
    </>
  );
} 