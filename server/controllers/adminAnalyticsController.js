const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Get sales analytics data
const getSalesAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get orders in date range
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $in: ['completed', 'delivered'] }
    }).populate('user', 'name email');

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get previous period for growth calculation
    const prevStartDate = new Date(startDate);
    const prevEndDate = new Date(startDate);
    const periodDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    prevStartDate.setDate(prevStartDate.getDate() - periodDays);
    prevEndDate.setDate(prevEndDate.getDate() - periodDays);

    const prevOrders = await Order.find({
      createdAt: { $gte: prevStartDate, $lte: prevEndDate },
      status: { $in: ['completed', 'delivered'] }
    });

    const prevRevenue = prevOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const growthRate = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Get top products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.product]) {
          productSales[item.product].revenue += item.price * item.quantity;
          productSales[item.product].orders += 1;
        } else {
          productSales[item.product] = {
            name: item.name,
            revenue: item.price * item.quantity,
            orders: 1
          };
        }
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Generate daily sales data
    const dailySales = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOrders = orders.filter(order => 
        order.createdAt.toDateString() === currentDate.toDateString()
      );
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      dailySales.push({
        date: currentDate.toISOString().split('T')[0],
        revenue: dayRevenue,
        orders: dayOrders.length
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      totalRevenue,
      totalOrders,
      averageOrderValue: Math.round(averageOrderValue),
      growthRate: Math.round(growthRate * 10) / 10,
      topProducts,
      dailySales
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({ message: 'Error fetching sales analytics' });
  }
};

// Get product analytics data
const getProductAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get products and orders
    const products = await Product.find();
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $in: ['completed', 'delivered'] }
    });

    // Calculate metrics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;

    // Get top sellers
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.product]) {
          productSales[item.product].sales += item.quantity;
          productSales[item.product].revenue += item.price * item.quantity;
        } else {
          productSales[item.product] = {
            name: item.name,
            sales: item.quantity,
            revenue: item.price * item.quantity,
            rating: 4.5 + Math.random() * 0.5 // Mock rating
          };
        }
      });
    });

    const topSellers = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Mock category performance
    const categoryPerformance = [
      { name: 'Clothing', revenue: 45000, products: 25, growth: 15.2 },
      { name: 'Jewelry', revenue: 32000, products: 18, growth: 12.8 },
      { name: 'Home Decor', revenue: 28000, products: 22, growth: 8.5 },
      { name: 'Food & Spices', revenue: 20000, products: 15, growth: 22.1 }
    ];

    // Get stock alerts
    const stockAlerts = products
      .filter(p => p.stock <= p.minStock)
      .map(p => ({
        name: p.name,
        currentStock: p.stock,
        minStock: p.minStock,
        daysLeft: Math.floor(p.stock / 2) // Mock calculation
      }))
      .slice(0, 4);

    res.json({
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      topSellers,
      categoryPerformance,
      stockAlerts
    });
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({ message: 'Error fetching product analytics' });
  }
};

// Get customer analytics data
const getCustomerAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get customers and orders
    const customers = await User.find({ role: 'user' });
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate metrics
    const totalCustomers = customers.length;
    const newCustomers = customers.filter(c => c.createdAt >= startDate).length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;

    // Calculate repeat customers
    const customerOrderCounts = {};
    orders.forEach(order => {
      const customerId = order.user.toString();
      customerOrderCounts[customerId] = (customerOrderCounts[customerId] || 0) + 1;
    });
    const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;

    // Get customer segments
    const customerSegments = [
      { name: 'New', count: Math.floor(totalCustomers * 0.36), percentage: 36, avgOrderValue: 150 },
      { name: 'Regular', count: Math.floor(totalCustomers * 0.544), percentage: 54.4, avgOrderValue: 280 },
      { name: 'VIP', count: Math.floor(totalCustomers * 0.096), percentage: 9.6, avgOrderValue: 850 }
    ];

    // Get top customers
    const customerSpending = {};
    orders.forEach(order => {
      const customerId = order.user.toString();
      if (customerSpending[customerId]) {
        customerSpending[customerId].totalSpent += order.totalAmount;
        customerSpending[customerId].orders += 1;
        if (order.createdAt > customerSpending[customerId].lastOrder) {
          customerSpending[customerId].lastOrder = order.createdAt;
        }
      } else {
        customerSpending[customerId] = {
          totalSpent: order.totalAmount,
          orders: 1,
          lastOrder: order.createdAt
        };
      }
    });

    const topCustomers = Object.entries(customerSpending)
      .sort(([,a], [,b]) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
      .map(([customerId, data]) => {
        const customer = customers.find(c => c._id.toString() === customerId);
        return {
          name: customer?.name || 'Unknown',
          email: customer?.email || 'unknown@email.com',
          totalSpent: data.totalSpent,
          orders: data.orders,
          lastOrder: data.lastOrder.toISOString().split('T')[0]
        };
      });

    // Mock retention and acquisition data
    const customerRetention = {
      oneMonth: 85,
      threeMonth: 72,
      sixMonth: 58,
      oneYear: 45
    };

    const customerAcquisition = [
      { source: 'Organic Search', customers: Math.floor(totalCustomers * 0.256), percentage: 25.6 },
      { source: 'Social Media', customers: Math.floor(totalCustomers * 0.224), percentage: 22.4 },
      { source: 'Direct Traffic', customers: Math.floor(totalCustomers * 0.2), percentage: 20 },
      { source: 'Referrals', customers: Math.floor(totalCustomers * 0.16), percentage: 16 },
      { source: 'Email Marketing', customers: Math.floor(totalCustomers * 0.16), percentage: 16 }
    ];

    res.json({
      totalCustomers,
      newCustomers,
      activeCustomers,
      repeatCustomers,
      customerSegments,
      topCustomers,
      customerRetention,
      customerAcquisition
    });
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({ message: 'Error fetching customer analytics' });
  }
};

// Get traffic analytics data
const getTrafficAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    
    // Mock traffic data (in a real app, this would come from Google Analytics or similar)
    const totalVisitors = 15420;
    const uniqueVisitors = 12350;
    const pageViews = 45680;
    const bounceRate = 35.2;
    const avgSessionDuration = 245;
    const conversionRate = 2.8;

    const trafficSources = [
      { source: 'Organic Search', visitors: 6200, percentage: 40.2, conversion: 3.2 },
      { source: 'Direct Traffic', visitors: 3850, percentage: 25.0, conversion: 2.8 },
      { source: 'Social Media', visitors: 3080, percentage: 20.0, conversion: 2.1 },
      { source: 'Referrals', visitors: 1540, percentage: 10.0, conversion: 2.5 },
      { source: 'Email Marketing', visitors: 750, percentage: 4.8, conversion: 4.2 }
    ];

    const topPages = [
      { page: '/products', views: 12500, visitors: 8900, bounceRate: 28.5 },
      { page: '/product/traditional-dress', views: 8500, visitors: 6200, bounceRate: 22.1 },
      { page: '/cart', views: 6800, visitors: 4500, bounceRate: 15.8 },
      { page: '/checkout', views: 4200, visitors: 3200, bounceRate: 8.5 },
      { page: '/about', views: 3800, visitors: 2800, bounceRate: 45.2 }
    ];

    const deviceBreakdown = [
      { device: 'Desktop', visitors: 9250, percentage: 60.0 },
      { device: 'Mobile', visitors: 4625, percentage: 30.0 },
      { device: 'Tablet', visitors: 1545, percentage: 10.0 }
    ];

    // Generate daily traffic data
    const dailyTraffic = [];
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const baseVisitors = 2000 + Math.random() * 1000;
      const visitors = Math.floor(baseVisitors);
      const pageViews = Math.floor(visitors * (2.5 + Math.random() * 1.5));
      const conversions = Math.floor(visitors * (0.02 + Math.random() * 0.02));
      
      dailyTraffic.push({
        date: currentDate.toISOString().split('T')[0],
        visitors,
        pageViews,
        conversions
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      totalVisitors,
      uniqueVisitors,
      pageViews,
      bounceRate,
      avgSessionDuration,
      conversionRate,
      trafficSources,
      topPages,
      deviceBreakdown,
      dailyTraffic
    });
  } catch (error) {
    console.error('Error fetching traffic analytics:', error);
    res.status(500).json({ message: 'Error fetching traffic analytics' });
  }
};

module.exports = {
  getSalesAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
  getTrafficAnalytics
}; 