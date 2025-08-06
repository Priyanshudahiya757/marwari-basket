const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function recreateAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwari-basket');
    console.log('Connected to MongoDB');
    
    // Delete existing admin if exists
    await User.deleteOne({ email: 'admin@marwaribasket.com' });
    console.log('🗑️ Deleted existing admin user');
    
    const adminData = {
      name: 'Admin User',
      email: 'admin@marwaribasket.com',
      phone: '9876543210',
      password: 'admin123', // This will be hashed automatically by the pre-save hook
      role: 'admin',
      isAdmin: true
    };
    
    const admin = await User.create(adminData);
    console.log('✅ New admin user created successfully!');
    
    console.log('\n📋 Admin Credentials:');
    console.log('Email: admin@marwaribasket.com');
    console.log('Password: admin123');
    console.log('\n🔗 You can now login to the admin panel');
    
    // Test password matching
    const passwordMatch = await admin.matchPassword('admin123');
    console.log('Password test:', passwordMatch ? '✅ Working' : '❌ Not working');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error recreating admin:', error);
    process.exit(1);
  }
}

recreateAdmin(); 