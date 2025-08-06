const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testAdminLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwari-basket');
    console.log('Connected to MongoDB');

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

    if (passwordMatch) {
      console.log('✅ Admin login credentials are working correctly!');
    } else {
      console.log('❌ Password does not match');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing admin login:', error);
    process.exit(1);
  }
}

// Run the test
testAdminLogin(); 