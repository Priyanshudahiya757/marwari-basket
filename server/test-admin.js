// Test script to check admin user
const mongoose = require('mongoose');
const User = require('./models/User');

async function testAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwari-basket');
    
    // Check if admin user exists
    const admin = await User.findOne({ email: 'admin@marwaribasket.com' });
    
    if (admin) {
      console.log('✅ Admin user found:');
      console.log('- Email:', admin.email);
      console.log('- Name:', admin.name);
      console.log('- Role:', admin.role);
      console.log('- isAdmin:', admin.isAdmin);
      
      // Test password
      const match = await admin.matchPassword('adminpass');
      console.log('- Password match:', match);
    } else {
      console.log('❌ Admin user not found');
    }
    
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testAdmin(); 