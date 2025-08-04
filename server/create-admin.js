// Create admin user with correct password
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwari-basket');
    
    // Delete existing admin user
    await User.deleteOne({ email: 'admin@marwaribasket.com' });
    
    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adminpass', salt);
    
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@marwaribasket.com',
      phone: '9876543211',
      password: hashedPassword,
      role: 'admin',
      isAdmin: true
    });
    
    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('- Email: admin@marwaribasket.com');
    console.log('- Password: adminpass');
    console.log('- Role: admin');
    
    // Test the password
    const match = await admin.matchPassword('adminpass');
    console.log('- Password match:', match);
    
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createAdmin(); 