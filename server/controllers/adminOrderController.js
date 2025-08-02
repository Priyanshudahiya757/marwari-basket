const Order = require('../models/Order');
const User = require('../models/User');
const { sendOrderStatusEmail, sendOrderStatusSMS } = require('../utils/email');
const { generateShippingLabel } = require('../utils/shipping');

// Get all orders with pagination and filtering
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, dateFrom, dateTo } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const oldStatus = order.status;
    order.status = status;
    
    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      notes: notes || `Status updated to ${status}`
    });
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    await order.save();
    
    // Send notifications
    try {
      if (order.user?.email) {
        await sendOrderStatusEmail(order.user.email, order.orderId, status, trackingNumber);
      }
      if (order.user?.phone) {
        await sendOrderStatusSMS(order.user.phone, order.orderId, status, trackingNumber);
      }
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Bulk actions
exports.bulkAction = async (req, res) => {
  try {
    const { action, orderIds, additionalData } = req.body;
    
    if (!action || !orderIds || !Array.isArray(orderIds)) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    
    switch (action) {
      case 'updateStatus':
        const { status } = additionalData;
        await Order.updateMany(
          { _id: { $in: orderIds } },
          { 
            status,
            $push: {
              statusHistory: {
                status,
                timestamp: new Date(),
                notes: `Bulk status update to ${status}`
              }
            }
          }
        );
        break;
        
      case 'print':
        // Generate invoices for printing
        const orders = await Order.find({ _id: { $in: orderIds } });
        // Here you would typically generate PDF invoices
        break;
        
      case 'export':
        // Export orders to CSV/Excel
        const exportOrders = await Order.find({ _id: { $in: orderIds } });
        // Here you would typically generate CSV/Excel file
        break;
        
      case 'fulfill':
        // Bulk fulfillment with shipping labels
        const fulfillOrders = await Order.find({ _id: { $in: orderIds } });
        for (const order of fulfillOrders) {
          if (order.status === 'processing') {
            order.status = 'shipped';
            order.statusHistory.push({
              status: 'shipped',
              timestamp: new Date(),
              notes: 'Bulk fulfillment'
            });
            await order.save();
          }
        }
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    
    res.json({ message: `Bulk action '${action}' completed successfully` });
  } catch (error) {
    console.error('Error performing bulk action:', error);
    res.status(500).json({ message: 'Error performing bulk action' });
  }
};

// Generate shipping label
exports.generateShippingLabel = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const shippingLabel = await generateShippingLabel(order);
    res.json({ shippingLabel });
  } catch (error) {
    console.error('Error generating shipping label:', error);
    res.status(500).json({ message: 'Error generating shipping label' });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));
    
    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$total' }
        }
      }
    ]);
    
    const totalOrders = await Order.countDocuments({ createdAt: { $gte: daysAgo } });
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo },
          status: { $nin: ['cancelled', 'returned'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    
    res.json({
      stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Error fetching order statistics' });
  }
};

// Process return
exports.processReturn = async (req, res) => {
  try {
    const { reason, refundAmount, notes } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = 'returned';
    order.statusHistory.push({
      status: 'returned',
      timestamp: new Date(),
      notes: `Return processed: ${reason}. Refund: ₹${refundAmount}`
    });
    
    await order.save();
    
    res.json({ order });
  } catch (error) {
    console.error('Error processing return:', error);
    res.status(500).json({ message: 'Error processing return' });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Here you would integrate with payment gateway for refund
    // For now, we'll just update the order
    
    order.statusHistory.push({
      status: 'refunded',
      timestamp: new Date(),
      notes: `Refund processed: ₹${amount}. Reason: ${reason}`
    });
    
    await order.save();
    
    res.json({ order });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ message: 'Error processing refund' });
  }
}; 