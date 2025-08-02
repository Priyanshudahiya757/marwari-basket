// Order Controller for Advanced Admin Panel
// Features: bulk actions, returns/refunds, packing slip/label generation, batch fulfillment, advanced filtering
// Enhanced with notification automation and payment processing

const Order = require('../models/Order');
const Product = require('../models/Product');
const { 
  sendOrderConfirmation, 
  sendShippingUpdate, 
  sendDeliveryConfirmation, 
  sendReturnNotification,
  sendAdminAlert 
} = require('../utils/email');
const { 
  sendOrderConfirmation: sendOrderSMS, 
  sendShippingUpdate: sendShippingSMS,
  sendDeliveryConfirmation: sendDeliverySMS,
  sendReturnNotification: sendReturnSMS,
  sendAdminAlert: sendAdminSMS 
} = require('../utils/sms');
const { 
  createShipment, 
  generateShippingLabel, 
  getTrackingInfo,
  processBatchFulfillment 
} = require('../utils/shipping');
const { 
  processPayment, 
  processRefund, 
  handlePaymentWebhook 
} = require('../utils/payment');

// Checkout endpoint (open to guests and users)
exports.checkout = async (req, res) => {
  try {
    const { cart, shippingAddress, billingAddress, shippingMethod, paymentMethod, paymentDetails } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = shippingMethod === 'express' ? 200 : (subtotal > 2000 ? 0 : 100);
    const totalAmount = subtotal + deliveryCharge;

    // Process payment
    const paymentResult = await processPayment(paymentDetails, totalAmount, 'temp_order_id');
    if (!paymentResult.success) {
      return res.status(400).json({ message: 'Payment failed: ' + paymentResult.error });
    }

    // Create order
    const order = new Order({
      user: req.user ? req.user._id : undefined,
      items: cart.map(item => ({ 
        product: item.product, 
        quantity: item.quantity, 
        price: item.price,
        sku: item.sku,
        name: item.name
      })),
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      shippingMethod,
      payment: {
        method: paymentMethod,
        status: paymentResult.success ? 'paid' : 'pending',
        transactionId: paymentResult.transactionId
      },
      totalAmount,
      deliveryCharge,
      customerEmail: shippingAddress.email,
      customerPhone: shippingAddress.phone
    });

    await order.save();

    // Send order confirmation notifications
    const orderData = {
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerName: order.shippingAddress.name,
      orderId: order._id,
      totalAmount: order.totalAmount
    };

    // Send email and SMS notifications
    await sendOrderConfirmation(orderData);
    await sendOrderSMS(orderData);

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
      paymentStatus: paymentResult.success ? 'paid' : 'pending'
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Webhook for delivery confirmation (carrier calls this)
exports.deliveryWebhook = async (req, res) => {
  try {
    const { trackingNumber, status, location } = req.body;
    
    const order = await Order.findOne({ trackingNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    order.orderStatus = status === 'delivered' ? 'delivered' : 'shipped';
    order.statusHistory.push({ 
      status: order.orderStatus, 
      note: `Carrier update: ${location}` 
    });

    await order.save();

    // Send delivery confirmation if delivered
    if (status === 'delivered') {
      const orderData = {
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerName: order.shippingAddress.name,
        orderId: order._id
      };

      await sendDeliveryConfirmation(orderData);
      await sendDeliverySMS(orderData);
    }

    res.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Delivery webhook error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get order statistics (admin only)
exports.getOrderStats = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const query = {};
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    
    const totalOrders = await Order.countDocuments(query);
    const totalRevenue = await Order.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const statusCounts = await Order.aggregate([
      { $match: query },
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders with advanced filtering (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const { 
      status, 
      search, 
      dateFrom, 
      dateTo, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    
    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name sku')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for the logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID (admin only)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name sku images');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.orderStatus = status;
    order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
    
    // Auto-generate packing slip and shipping label for 'packed' status
    if (status === 'packed') {
      order.packingSlipUrl = `/api/orders/${order._id}/packing-slip`;
      order.shippingLabelUrl = `/api/orders/${order._id}/shipping-label`;
    }

    // Create shipment and send notifications for 'shipped' status
    if (status === 'shipped') {
      const shipment = await createShipment(order);
      if (shipment.success) {
        order.trackingNumber = shipment.trackingNumber;
        order.carrier = shipment.carrier;
        order.trackingUrl = shipment.trackingUrl;
      }

      // Send shipping notifications
      const orderData = {
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerName: order.shippingAddress.name,
        orderId: order._id,
        orderStatus: status,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl
      };

      await sendShippingUpdate(orderData);
      await sendShippingSMS(orderData);
    }

    // Send delivery notification for 'delivered' status
    if (status === 'delivered') {
      const orderData = {
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerName: order.shippingAddress.name,
        orderId: order._id
      };

      await sendDeliveryConfirmation(orderData);
      await sendDeliverySMS(orderData);
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk update order statuses (admin only)
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { orderIds, status, note } = req.body;
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: 'Order IDs array is required' });
    }
    
    const results = [];
    for (const orderId of orderIds) {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          results.push({ orderId, error: 'Order not found' });
          continue;
        }
        
        order.orderStatus = status;
        order.statusHistory.push({ status, note: note || `Bulk status update to ${status}` });
        
        if (status === 'packed') {
          order.packingSlipUrl = `/api/orders/${order._id}/packing-slip`;
          order.shippingLabelUrl = `/api/orders/${order._id}/shipping-label`;
        }
        
        await order.save();
        results.push({ orderId, success: true });
      } catch (error) {
        results.push({ orderId, error: error.message });
      }
    }
    
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process return request (admin only)
exports.processReturn = async (req, res) => {
  try {
    const { returnReason, refundAmount } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.returnRequested = true;
    order.returnReason = returnReason;
    order.refundStatus = 'pending';
    order.refundAmount = refundAmount || order.totalAmount;
    order.orderStatus = 'returned';
    order.statusHistory.push({ status: 'returned', note: `Return processed: ${returnReason}` });
    
    await order.save();

    // Send return notification
    const orderData = {
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerName: order.shippingAddress.name,
      orderId: order._id,
      returnReason,
      refundAmount: order.refundAmount
    };

    await sendReturnNotification(orderData);
    await sendReturnSMS(orderData);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process refund (admin only)
exports.processRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Process refund through payment gateway
    const refundResult = await processRefund(
      order.payment.transactionId, 
      order.refundAmount, 
      order.returnReason
    );

    if (refundResult.success) {
      order.refundStatus = 'processed';
      order.payment.status = 'refunded';
      order.statusHistory.push({ status: 'refunded', note: 'Refund processed' });
      await order.save();
    }
    
    res.json({ order, refundResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate packing slip (admin only)
exports.generatePackingSlip = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name sku');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Mock packing slip generation
    const packingSlip = {
      orderId: order._id,
      customerName: order.shippingAddress.name,
      items: order.items,
      totalAmount: order.totalAmount,
      date: new Date()
    };
    
    res.json(packingSlip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate shipping label (admin only)
exports.generateShippingLabel = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    const labelResult = await generateShippingLabel(order);
    if (labelResult.success) {
      res.json(labelResult);
    } else {
      res.status(500).json({ message: 'Failed to generate shipping label' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Place a new order (legacy, for logged-in users)
exports.placeOrder = async (req, res) => {
  try {
    const { items, address, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    const order = new Order({
      user: req.user._id,
      items: items.map(item => ({ product: item.product, quantity: item.quantity, price: item.price })),
      shippingAddress: { address },
      totalAmount
    });

    await order.save();

    // Send order confirmation
    const orderData = {
      customerEmail: req.user.email,
      customerPhone: req.user.phone,
      customerName: req.user.name,
      orderId: order._id,
      totalAmount: order.totalAmount
    };

    await sendOrderConfirmation(orderData);
    await sendOrderSMS(orderData);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 

// Payment webhook (payment gateway calls this)
exports.paymentWebhook = async (req, res) => {
  try {
    const { type, data, orderId } = req.body;
    
    // Verify webhook signature for security
    const signature = req.headers['stripe-signature'] || req.headers['razorpay-signature'];
    if (signature) {
      const isValid = require('../utils/payment').verifyWebhookSignature(
        JSON.stringify(req.body), 
        signature
      );
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid webhook signature' });
      }
    }
    
    // Process payment webhook
    const webhookResult = await handlePaymentWebhook({ type, data, orderId });
    if (webhookResult.success) {
      res.json({ message: 'Payment webhook processed successfully' });
    } else {
      res.status(400).json({ message: 'Failed to process payment webhook' });
    }
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Shipping webhook (carrier calls this for status updates)
exports.shippingWebhook = async (req, res) => {
  try {
    const { trackingNumber, status, location, estimatedDelivery } = req.body;
    
    const order = await Order.findOne({ trackingNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status based on carrier status
    let orderStatus = order.orderStatus;
    if (status === 'in_transit') orderStatus = 'shipped';
    else if (status === 'out_for_delivery') orderStatus = 'shipped';
    else if (status === 'delivered') orderStatus = 'delivered';
    else if (status === 'exception') orderStatus = 'exception';

    order.orderStatus = orderStatus;
    order.statusHistory.push({ 
      status: orderStatus, 
      note: `Carrier update: ${status} - ${location}` 
    });

    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    await order.save();

    // Send notifications based on status
    if (status === 'delivered') {
      const orderData = {
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerName: order.shippingAddress.name,
        orderId: order._id
      };

      await sendDeliveryConfirmation(orderData);
      await sendDeliverySMS(orderData);
    }

    res.json({ message: 'Shipping webhook processed successfully' });
  } catch (error) {
    console.error('Shipping webhook error:', error);
    res.status(500).json({ message: error.message });
  }
}; 