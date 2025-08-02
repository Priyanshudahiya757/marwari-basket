const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getInventory,
  getStockAlerts,
  updateStock,
  bulkUpdateStock,
  getSuppliers,
  generatePurchaseOrder,
  getInventoryReports
} = require('../controllers/adminInventoryController');

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Inventory management
router.get('/inventory', getInventory);
router.put('/inventory/:id/stock', updateStock);
router.post('/inventory/bulk-update', bulkUpdateStock);

// Stock alerts
router.get('/alerts', getStockAlerts);

// Supplier management
router.get('/suppliers', getSuppliers);
router.post('/purchase-order', generatePurchaseOrder);

// Reports
router.get('/reports', getInventoryReports);

module.exports = router; 