const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Setup admin user (for production use only)
router.post('/setup', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@marwaribasket.com' });
    
    if (existingAdmin) {
      return res.json({ 
        message: 'Admin user already exists',
        email: existingAdmin.email,
        role: existingAdmin.role
      });
    }
    
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@marwaribasket.com',
      phone: '9876543211',
      password: 'adminpass',
      role: 'admin',
      isAdmin: true
    });
    
    await admin.save();
    
    res.json({ 
      message: 'Admin user created successfully',
      email: admin.email,
      password: 'adminpass',
      role: admin.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 