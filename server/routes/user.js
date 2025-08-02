const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Get current user's profile
router.get('/profile', protect, userController.getProfile);

// Update current user's profile
router.put('/profile', protect, userController.updateProfile);

// Change password
router.put('/change-password', protect, userController.changePassword);

// Address management
router.get('/addresses', protect, userController.getAddresses);
router.post('/addresses', protect, userController.addAddress);
router.put('/addresses/:id', protect, userController.updateAddress);
router.delete('/addresses/:id', protect, userController.deleteAddress);

// Get user statistics (admin only)
router.get('/stats', protect, admin, userController.getUserStats);

// Get all customers (admin only)
router.get('/customers', protect, admin, userController.getAllCustomers);

// Get customer by ID with order history (admin only)
router.get('/customers/:id', protect, admin, userController.getCustomerById);

// Update customer profile (admin only)
router.put('/customers/:id', protect, admin, userController.updateCustomer);

// Add communication log (admin only)
router.post('/customers/:id/comm-log', protect, admin, userController.addCommLog);

// Get all staff users (admin only)
router.get('/staff', protect, admin, userController.getAllStaff);

// Create staff user (admin only)
router.post('/staff', protect, admin, userController.createStaff);

// Update staff user (admin only)
router.put('/staff/:id', protect, admin, userController.updateStaff);

// Delete staff user (admin only)
router.delete('/staff/:id', protect, admin, userController.deleteStaff);

module.exports = router; 