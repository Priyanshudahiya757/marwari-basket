const mongoose = require('mongoose');
const User = require('./models/User');
const { testConnection } = require('./config/db');
require('dotenv').config();

async function testLogin() {
  try {
    console.log('🧪 Testing login functionality...');
    
    // Check environment variables
    console.log('📋 Environment variables:');
    console.log('   - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
    console.log('   - JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
    console.log('   - NODE_ENV:', process.env.NODE_ENV || 'development');
    
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
    
    // Test admin user existence
    console.log('🔍 Checking for admin user...');
    const adminUser = await User.findOne({ email: 'admin@marwaribasket.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      console.log('💡 Run: node seed/recreate-admin.js to create admin user');
      process.exit(1);
    }
    
    console.log('✅ Admin user found:', adminUser.email);
    
    // Test password matching
    console.log('🔐 Testing password verification...');
    const passwordMatch = await adminUser.matchPassword('admin123');
    
    if (!passwordMatch) {
      console.log('❌ Password verification failed');
      console.log('💡 Run: node seed/recreate-admin.js to reset admin password');
      process.exit(1);
    }
    
    console.log('✅ Password verification successful');
    
    // Test JWT token generation
    console.log('🔐 Testing JWT token generation...');
    const jwt = require('jsonwebtoken');
    
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not defined');
      process.exit(1);
    }
    
    const token = jwt.sign(
      { id: adminUser._id, email: adminUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('✅ JWT token generated successfully');
    console.log('📝 Token preview:', token.substring(0, 20) + '...');
    
    console.log('\n🎉 All tests passed! Login functionality is working correctly.');
    console.log('\n📋 Admin credentials:');
    console.log('   Email: admin@marwaribasket.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('🔍 Error stack:', error.stack);
    process.exit(1);
  }
}

testLogin(); 