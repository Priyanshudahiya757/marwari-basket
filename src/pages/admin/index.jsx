import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import {
  SalesOverviewWidget,
  OrdersStatusWidget,
  TopProductsWidget,
  RecentActivityWidget,
  StockAlertsWidget,
  QuickActionsWidget
} from '../../components/admin/Dashboard/DashboardWidgets';

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Admin dashboard page loading...');
    // Simulate loading time for widgets
    const timer = setTimeout(() => {
      console.log('Admin dashboard loading complete');
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="admin-layout">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin!</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors admin-focus-visible">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="admin-main">
          <div className="content-wrapper">
            {/* Page Header */}
            <div className="page-header">
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Welcome back, Admin! Here's what's happening with your store today.</p>
            </div>

            {/* Loading Skeletons */}
            <div className="dashboard-grid cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="widget-card">
                  <div className="widget-header">
                    <div className="loading-skeleton h-6 w-32 rounded"></div>
                    <div className="loading-skeleton h-5 w-16 rounded"></div>
                  </div>
                  <div className="stats-grid">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="stat-item">
                        <div className="loading-skeleton h-8 w-20 rounded mx-auto mb-2"></div>
                        <div className="loading-skeleton h-4 w-16 rounded mx-auto"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-grid cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="widget-card">
                  <div className="widget-header">
                    <div className="loading-skeleton h-6 w-40 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-center justify-between">
                        <div className="loading-skeleton h-4 w-24 rounded"></div>
                        <div className="loading-skeleton h-4 w-16 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-grid cols-1">
              <div className="widget-card">
                <div className="widget-header">
                  <div className="loading-skeleton h-6 w-48 rounded"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="loading-skeleton h-10 w-10 rounded-full"></div>
                      <div className="flex-1">
                        <div className="loading-skeleton h-4 w-32 rounded mb-1"></div>
                        <div className="loading-skeleton h-3 w-48 rounded"></div>
                      </div>
                      <div className="loading-skeleton h-4 w-16 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin!</p>
          </div>
        </header>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="admin-main">
          <div className="content-wrapper">
            <div className="page-header">
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Welcome back, Admin!</p>
            </div>
            
            <div className="widget-card">
              <div className="text-center py-8">
                <div className="text-red-600 mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-primary"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin!</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors admin-focus-visible">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="admin-main">
        <div className="content-wrapper">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, Admin! Here's what's happening with your store today.</p>
          </div>

          {/* Main Stats Row */}
          <div className="dashboard-grid cols-3">
            <div className="widget-card fade-in">
              <SalesOverviewWidget />
            </div>
            <div className="widget-card fade-in" style={{ animationDelay: '0.1s' }}>
              <OrdersStatusWidget />
            </div>
            <div className="widget-card fade-in" style={{ animationDelay: '0.2s' }}>
              <QuickActionsWidget />
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="dashboard-grid cols-2">
            <div className="widget-card fade-in" style={{ animationDelay: '0.3s' }}>
              <TopProductsWidget />
            </div>
            <div className="widget-card fade-in" style={{ animationDelay: '0.4s' }}>
              <StockAlertsWidget />
            </div>
          </div>

          {/* Activity Row */}
          <div className="dashboard-grid cols-1">
            <div className="widget-card fade-in" style={{ animationDelay: '0.5s' }}>
              <RecentActivityWidget />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 