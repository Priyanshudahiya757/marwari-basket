const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/sales', dashboardController.getSales);
router.get('/orders', dashboardController.getOrders);
router.get('/revenue', dashboardController.getRevenue);
router.get('/top-products', dashboardController.getTopProducts);
router.get('/stock-alerts', dashboardController.getStockAlerts);
router.get('/traffic', dashboardController.getTraffic);

module.exports = router; 