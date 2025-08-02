const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const adminOrderController = require('../controllers/adminOrderController');

// Apply authentication middleware to all routes
router.use(protect);
router.use(admin);

// Get all orders with pagination and filtering
router.get('/', adminOrderController.getAllOrders);

// Get order statistics
router.get('/stats', adminOrderController.getOrderStats);

// Get single order
router.get('/:id', adminOrderController.getOrder);

// Update order status
router.put('/:id/status', adminOrderController.updateOrderStatus);

// Generate shipping label
router.post('/:id/shipping-label', adminOrderController.generateShippingLabel);

// Process return
router.post('/:id/return', adminOrderController.processReturn);

// Process refund
router.post('/:id/refund', adminOrderController.processRefund);

// Bulk actions
router.post('/bulk', adminOrderController.bulkAction);

module.exports = router; 