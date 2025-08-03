import React, { useState, useEffect } from 'react';

// Sales Overview Widget
export function SalesOverviewWidget() {
  const [salesData, setSalesData] = useState({
    today: 12450,
    week: 87500,
    month: 325000,
    growth: 12.5
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch sales data
    const fetchSalesData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/dashboard/sales-overview');
        if (!response.ok) {
          throw new Error('Failed to fetch sales data');
        }
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError(error.message);
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchSalesData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse h-full">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
          +{salesData.growth}%
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 flex-1">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">₹{salesData.today.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Today</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">₹{salesData.week.toLocaleString()}</p>
          <p className="text-sm text-gray-500">This Week</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">₹{salesData.month.toLocaleString()}</p>
          <p className="text-sm text-gray-500">This Month</p>
        </div>
      </div>
      {error && (
        <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">
          Using fallback data
        </div>
      )}
    </div>
  );
}

// Orders Status Widget
export function OrdersStatusWidget() {
  const [ordersData, setOrdersData] = useState({
    pending: 8,
    processing: 12,
    shipped: 25,
    delivered: 45,
    cancelled: 3
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/dashboard/orders-status');
        if (!response.ok) {
          throw new Error('Failed to fetch orders data');
        }
        const data = await response.json();
        setOrdersData(data);
      } catch (error) {
        console.error('Error fetching orders data:', error);
        setError(error.message);
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrdersData();
  }, []);

  const totalOrders = Object.values(ordersData).reduce((sum, count) => sum + count, 0);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse h-full">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Status</h3>
      <div className="space-y-3 flex-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Pending</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(ordersData.pending / totalOrders) * 100}%` }}></div>
            </div>
            <span className="text-sm font-medium">{ordersData.pending}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Processing</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(ordersData.processing / totalOrders) * 100}%` }}></div>
            </div>
            <span className="text-sm font-medium">{ordersData.processing}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Shipped</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(ordersData.shipped / totalOrders) * 100}%` }}></div>
            </div>
            <span className="text-sm font-medium">{ordersData.shipped}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Delivered</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(ordersData.delivered / totalOrders) * 100}%` }}></div>
            </div>
            <span className="text-sm font-medium">{ordersData.delivered}</span>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">
          Using fallback data
        </div>
      )}
    </div>
  );
}

// Top Products Widget
export function TopProductsWidget() {
  const [topProducts, setTopProducts] = useState([
    { name: 'Block Print Saree', sales: 45, revenue: 67500 },
    { name: 'Handcrafted Pottery', sales: 32, revenue: 48000 },
    { name: 'Traditional Jewelry', sales: 28, revenue: 42000 },
    { name: 'Rajasthani Shawl', sales: 25, revenue: 37500 },
    { name: 'Leather Bags', sales: 22, revenue: 33000 }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/dashboard/top-products');
        if (!response.ok) {
          throw new Error('Failed to fetch top products');
        }
        const data = await response.json();
        setTopProducts(data.products || topProducts);
      } catch (error) {
        console.error('Error fetching top products:', error);
        setError(error.message);
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse h-full">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-3 bg-gray-200 rounded w-4"></div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {topProducts.map((product, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sales} sold</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>
      {error && (
        <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">
          Using fallback data
        </div>
      )}
    </div>
  );
}

// Recent Activity Widget
export function RecentActivityWidget() {
  const [activities, setActivities] = useState([
    { type: 'order', message: 'New order #1234 received', time: '2 minutes ago', user: 'Customer' },
    { type: 'product', message: 'Product "Block Print Saree" stock updated', time: '15 minutes ago', user: 'Admin' },
    { type: 'customer', message: 'New customer registered', time: '1 hour ago', user: 'System' },
    { type: 'payment', message: 'Payment received for order #1230', time: '2 hours ago', user: 'System' },
    { type: 'shipping', message: 'Order #1228 shipped', time: '3 hours ago', user: 'Admin' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/dashboard/recent-activity');
        if (!response.ok) {
          throw new Error('Failed to fetch recent activity');
        }
        const data = await response.json();
        setActivities(data.activities || activities);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        setError(error.message);
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentActivity();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return '📦';
      case 'product': return '🧵';
      case 'customer': return '👤';
      case 'payment': return '💰';
      case 'shipping': return '🚚';
      default: return '📝';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse h-full">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 bg-gray-200 rounded w-16"></div>
                  <div className="h-2 bg-gray-200 rounded w-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <span className="text-lg">{getActivityIcon(activity.type)}</span>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">{activity.time}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{activity.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">
          Using fallback data
        </div>
      )}
    </div>
  );
}

// Stock Alerts Widget
export function StockAlertsWidget() {
  const [stockAlerts, setStockAlerts] = useState([
    { product: 'Block Print Saree', current: 5, min: 10, status: 'critical' },
    { product: 'Handcrafted Pottery', current: 8, min: 15, status: 'warning' },
    { product: 'Traditional Jewelry', current: 3, min: 8, status: 'critical' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockAlerts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/dashboard/stock-alerts');
        if (!response.ok) {
          throw new Error('Failed to fetch stock alerts');
        }
        const data = await response.json();
        setStockAlerts(data.alerts || stockAlerts);
      } catch (error) {
        console.error('Error fetching stock alerts:', error);
        setError(error.message);
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchStockAlerts();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
        <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
          {stockAlerts.length} Alerts
        </span>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {stockAlerts.map((alert, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">{alert.product}</p>
              <p className="text-xs text-gray-500">
                {alert.current} in stock (min: {alert.min})
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              alert.status === 'critical' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {alert.status === 'critical' ? 'Critical' : 'Low'}
            </span>
          </div>
        ))}
      </div>
      {error && (
        <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">
          Using fallback data
        </div>
      )}
    </div>
  );
}

// Quick Actions Widget
export function QuickActionsWidget() {
  const quickActions = [
    { name: 'Add Product', icon: '➕', path: '/admin/products', color: 'bg-blue-500' },
    { name: 'View Orders', icon: '📦', path: '/admin/orders', color: 'bg-green-500' },
    { name: 'Customer Support', icon: '💬', path: '/admin/customers', color: 'bg-yellow-500' },
    { name: 'Settings', icon: '⚙️', path: '/admin/settings', color: 'bg-gray-500' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => window.location.href = action.path}
            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <span className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center text-white text-sm`}>
              {action.icon}
            </span>
            <span className="text-sm font-medium text-gray-900">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 