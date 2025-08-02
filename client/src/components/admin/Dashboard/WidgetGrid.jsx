import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import Widget from './Widget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const layout = [
  { i: 'sales', x: 0, y: 0, w: 2, h: 2 },
  { i: 'orders', x: 2, y: 0, w: 2, h: 2 },
  { i: 'revenue', x: 4, y: 0, w: 2, h: 2 },
  { i: 'top-products', x: 0, y: 2, w: 3, h: 2 },
  { i: 'stock-alerts', x: 3, y: 2, w: 2, h: 2 },
  { i: 'traffic', x: 5, y: 2, w: 1, h: 2 },
];

export default function WidgetGrid() {
  const [dashboardData, setDashboardData] = useState({
    sales: '₹0',
    orders: '0',
    revenue: '₹0',
    topProducts: 'Loading...',
    stockAlerts: '0',
    traffic: '0'
  });

  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector('.widget-grid-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [salesRes, ordersRes, revenueRes, topProductsRes, stockAlertsRes, trafficRes] = await Promise.all([
          fetch('/api/admin/dashboard/sales'),
          fetch('/api/admin/dashboard/orders'),
          fetch('/api/admin/dashboard/revenue'),
          fetch('/api/admin/dashboard/top-products'),
          fetch('/api/admin/dashboard/stock-alerts'),
          fetch('/api/admin/dashboard/traffic')
        ]);

        const sales = await salesRes.json();
        const orders = await ordersRes.json();
        const revenue = await revenueRes.json();
        const topProducts = await topProductsRes.json();
        const stockAlerts = await stockAlertsRes.json();
        const traffic = await trafficRes.json();

        setDashboardData({
          sales: `₹${sales.sales?.toLocaleString() || '0'}`,
          orders: orders.orders?.toString() || '0',
          revenue: `₹${revenue.revenue?.toLocaleString() || '0'}`,
          topProducts: topProducts.topProducts?.[0] || 'No data',
          stockAlerts: stockAlerts.stockAlerts?.length?.toString() || '0',
          traffic: traffic.traffic?.toLocaleString() || '0'
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data if API fails
        setDashboardData({
          sales: '₹12,450',
          orders: '320',
          revenue: '₹2,50,000',
          topProducts: 'Block Print Saree',
          stockAlerts: '3',
          traffic: '1,200'
        });
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="widget-grid-container w-full">
      <GridLayout 
        className="layout" 
        layout={layout} 
        cols={6} 
        rowHeight={90} 
        width={containerWidth} 
        isResizable 
        isDraggable
        margin={[16, 16]}
        containerPadding={[16, 16]}
      >
        <div key="sales"><Widget title="Sales" value={dashboardData.sales} icon="💰" color="bg-yellow-100" /></div>
        <div key="orders"><Widget title="Orders" value={dashboardData.orders} icon="📦" color="bg-pink-100" /></div>
        <div key="revenue"><Widget title="Revenue" value={dashboardData.revenue} icon="📈" color="bg-green-100" /></div>
        <div key="top-products"><Widget title="Top Products" value={dashboardData.topProducts} icon="🧵" color="bg-blue-100" /></div>
        <div key="stock-alerts"><Widget title="Stock Alerts" value={`${dashboardData.stockAlerts} Low`} icon="⚠️" color="bg-red-100" /></div>
        <div key="traffic"><Widget title="Traffic" value={dashboardData.traffic} icon="🌐" color="bg-purple-100" /></div>
      </GridLayout>
    </div>
  );
} 