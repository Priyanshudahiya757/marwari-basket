const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testLoginFlow() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwari-basket');
    console.log('Connected to MongoDB');

    // Check JWT_SECRET
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET is not set!');
      process.exit(1);
    }

    // Find admin user
    const admin = await User.findOne({ email: 'admin@marwaribasket.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('IsAdmin:', admin.isAdmin);

    // Test password matching
    const passwordMatch = await admin.matchPassword('admin123');
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      console.log('❌ Password does not match');
      process.exit(1);
    }

    // Test JWT token generation
    const token = jwt.sign({ 
      id: admin._id, 
      email: admin.email, 
      role: admin.role,
      isAdmin: admin.isAdmin 
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ JWT token generated successfully');
    console.log('Token length:', token.length);

    // Test JWT token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT token verified successfully');
    console.log('Decoded user ID:', decoded.id);
    console.log('Decoded role:', decoded.role);

    console.log('\n🎉 Complete login flow test passed!');
    console.log('📋 Test Results:');
    console.log('   ✅ Admin user exists');
    console.log('   ✅ Password matches');
    console.log('   ✅ JWT_SECRET is set');
    console.log('   ✅ JWT token generation works');
    console.log('   ✅ JWT token verification works');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing login flow:', error);
    process.exit(1);
  }
}

// Run the test
testLoginFlow(); 