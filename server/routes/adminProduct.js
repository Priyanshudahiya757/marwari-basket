const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const adminProductController = require('../controllers/adminProductController');

// Apply authentication middleware to all routes
router.use(protect);
router.use(admin);

// Get all products with pagination and filtering
router.get('/', adminProductController.getAllProducts);

// Get product statistics
router.get('/stats', adminProductController.getProductStats);

// Get single product
router.get('/:id', adminProductController.getProduct);

// Create new product (with file upload)
router.post('/', upload.array('images', 5), adminProductController.createProduct);

// Update product (with file upload)
router.put('/:id', upload.array('images', 5), adminProductController.updateProduct);

// Delete product
router.delete('/:id', adminProductController.deleteProduct);

// Bulk actions
router.post('/bulk', adminProductController.bulkAction);

module.exports = router; 