const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Checkout endpoint (open to guests and users)
router.post('/checkout', orderController.checkout);

// Webhook for delivery confirmation (carrier calls this)
router.post('/webhook/delivery', orderController.deliveryWebhook);

// Payment webhook (payment gateway calls this)
router.post('/webhook/payment', orderController.paymentWebhook);

// Shipping webhook (carrier calls this for status updates)
router.post('/webhook/shipping', orderController.shippingWebhook);

// Get order statistics (admin only)
router.get('/stats', protect, admin, orderController.getOrderStats);

// Get all orders with advanced filtering (admin only)
router.get('/', protect, admin, orderController.getAllOrders);

// Get all orders for the logged-in user
router.get('/my-orders', protect, orderController.getMyOrders);

// Get a single order by ID (admin only)
router.get('/:id', protect, admin, orderController.getOrderById);

// Update order status (admin only)
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);

// Bulk update order statuses (admin only)
router.put('/bulk-status', protect, admin, orderController.bulkUpdateStatus);

// Process return request (admin only)
router.post('/:id/return', protect, admin, orderController.processReturn);

// Process refund (admin only)
router.post('/:id/refund', protect, admin, orderController.processRefund);

// Generate packing slip (admin only)
router.get('/:id/packing-slip', protect, admin, orderController.generatePackingSlip);

// Generate shipping label (admin only)
router.get('/:id/shipping-label', protect, admin, orderController.generateShippingLabel);

// Place a new order (legacy, for logged-in users)
router.post('/', protect, orderController.placeOrder);

module.exports = router; 