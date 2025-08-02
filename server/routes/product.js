const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const productController = require('../controllers/productController');

// Get all products (with filtering and pagination)
router.get('/', productController.getAllProducts);

// Get low stock products (admin only)
router.get('/low-stock', protect, admin, productController.getLowStockProducts);

// Get a single product by ID
router.get('/:id', productController.getProductById);

// Create a new product (admin only)
router.post('/', protect, admin, productController.createProduct);

// Bulk upload products (admin only)
router.post('/bulk-upload', protect, admin, productController.bulkUpload);

// Update a product (admin only)
router.put('/:id', protect, admin, productController.updateProduct);

// Toggle product status (admin only)
router.patch('/:id/toggle-status', protect, admin, productController.toggleStatus);

// Delete a product (admin only)
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router; 