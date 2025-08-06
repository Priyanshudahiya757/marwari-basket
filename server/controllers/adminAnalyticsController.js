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
    const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 10)).length;
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

    // Get stock alerts
    const stockAlerts = products
      .filter(p => p.stock <= (p.minStock || 10))
      .map(p => ({
        name: p.name,
        currentStock: p.stock,
        minStock: p.minStock || 10,
        daysLeft: Math.floor(p.stock / 2) // Mock calculation
      }))
      .slice(0, 4);

    res.json({
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      topSellers,
      categoryPerformance: [], // Empty for fresh start
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

    res.json({
      totalCustomers,
      newCustomers,
      activeCustomers,
      repeatCustomers,
      customerSegments: [], // Empty for fresh start
      topCustomers,
      customerRetention: { oneMonth: 0, threeMonth: 0, sixMonth: 0, oneYear: 0 },
      customerAcquisition: [] // Empty for fresh start
    });
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({ message: 'Error fetching customer analytics' });
  }
};

// Get traffic analytics data
const getTrafficAnalytics = async (req, res) => {
  try {
    // Return zeros for fresh start - in a real app, this would come from Google Analytics
    const totalVisitors = 0;
    const uniqueVisitors = 0;
    const pageViews = 0;
    const bounceRate = 0;
    const avgSessionDuration = 0;
    const conversionRate = 0;

    res.json({
      totalVisitors,
      uniqueVisitors,
      pageViews,
      bounceRate,
      avgSessionDuration,
      conversionRate,
      trafficSources: [], // Empty for fresh start
      topPages: [], // Empty for fresh start
      deviceBreakdown: [], // Empty for fresh start
      dailyTraffic: [] // Empty for fresh start
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