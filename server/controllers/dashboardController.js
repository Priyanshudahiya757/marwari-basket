const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getSales = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    res.json({ sales: totalSales[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sales data' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    res.json({ orders: orderCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders data' });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    res.json({ revenue: totalRevenue[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching revenue data' });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json({ topProducts: topProducts.map(p => p._id) });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching top products data' });
  }
};

exports.getStockAlerts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
    res.json({ stockAlerts: lowStockProducts.map(p => ({ name: p.name, stock: p.stock })) });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stock alerts data' });
  }
};

exports.getTraffic = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ traffic: userCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching traffic data' });
  }
}; 