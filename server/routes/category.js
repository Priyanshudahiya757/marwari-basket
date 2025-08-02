const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get a single category by ID
router.get('/:id', categoryController.getCategoryById);

// Create a new category (admin only)
router.post('/', protect, admin, categoryController.createCategory);

// Update a category (admin only)
router.put('/:id', protect, admin, categoryController.updateCategory);

// Delete a category (admin only)
router.delete('/:id', protect, admin, categoryController.deleteCategory);

module.exports = router; 