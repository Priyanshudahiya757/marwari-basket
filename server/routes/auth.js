const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('../middleware/rateLimit');

// Registration
router.post('/register', rateLimit, authController.register);
// Login
router.post('/login', rateLimit, authController.login);
// Forgot password
router.post('/forgot-password', rateLimit, authController.forgotPassword);
// Reset password
router.post('/reset-password', rateLimit, authController.resetPassword);

module.exports = router; 