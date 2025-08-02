const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getSalesAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
  getTrafficAnalytics
} = require('../controllers/adminAnalyticsController');

// All routes require authentication and admin privileges
router.use(protect);
router.use(admin);

// Analytics routes
router.get('/sales', getSalesAnalytics);
router.get('/products', getProductAnalytics);
router.get('/customers', getCustomerAnalytics);
router.get('/traffic', getTrafficAnalytics);

module.exports = router; 