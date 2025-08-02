import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState('calc(100vh - 70px)');
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Dynamic boundary detection for sidebar height
  useEffect(() => {
    const updateSidebarHeight = () => {
      const headerHeight = 70; // Fixed header height
      const viewportHeight = window.innerHeight;

      // Calculate available height for sidebar
      const availableHeight = viewportHeight - headerHeight;

      // Ensure minimum height and prevent overflow
      const calculatedHeight = Math.max(availableHeight, 400); // Minimum 400px height

      setSidebarHeight(`${calculatedHeight}px`);
    };

    // Initial calculation
    updateSidebarHeight();

    // Update on window resize
    window.addEventListener('resize', updateSidebarHeight);

    // Cleanup
    return () => window.removeEventListener('resize', updateSidebarHeight);
  }, []);

  // Additional boundary detection for scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        const sidebar = sidebarRef.current;
        const sidebarRect = sidebar.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const headerHeight = 70;

        // Check if sidebar is approaching viewport bottom
        const sidebarBottom = sidebarRect.bottom;
        const viewportBottom = viewportHeight;

        if (sidebarBottom > viewportBottom) {
          // Adjust sidebar height to prevent overflow
          const maxHeight = viewportBottom - sidebarRect.top;
          sidebar.style.maxHeight = `${Math.max(maxHeight, 400)}px`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      ref={sidebarRef}
      className="admin-sidebar"
      style={{
        height: sidebarHeight,
        maxHeight: sidebarHeight
      }}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2>Admin Panel</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {/* Dashboard */}
        <Link
          to="/admin"
          className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
          </svg>
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {/* Products */}
        <Link
          to="/admin/products"
          className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          {!collapsed && <span>Products</span>}
        </Link>

        {/* Orders */}
        <Link
          to="/admin/orders"
          className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {!collapsed && <span>Orders</span>}
        </Link>

        {/* Customers */}
        <Link
          to="/admin/customers"
          className={`nav-item ${isActive('/admin/customers') ? 'active' : ''}`}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          {!collapsed && <span>Customers</span>}
        </Link>

        {/* Settings */}
        <Link
          to="/admin/settings"
          className={`nav-item ${isActive('/admin/settings') ? 'active' : ''}`}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Help */}
        <Link
          to="/admin/help"
          className={`nav-item ${isActive('/admin/help') ? 'active' : ''}`}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {!collapsed && <span>Help</span>}
        </Link>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            A
          </div>
          {!collapsed && (
            <div className="user-info">
              <p className="user-name">Admin User</p>
              <p className="user-email">admin@marwaribasket.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 