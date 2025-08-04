// Create admin user with simple password (let pre-save hook hash it)
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdminSimple() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwari-basket');
    
    // Delete existing admin user
    await User.deleteOne({ email: 'admin@marwaribasket.com' });
    
    // Create admin user with plain password (will be hashed by pre-save hook)
    const admin = new User({
      name: 'Admin User',
      email: 'admin@marwaribasket.com',
      phone: '9876543211',
      password: 'adminpass', // Plain password - will be hashed by pre-save hook
      role: 'admin',
      isAdmin: true
    });
    
    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('- Email: admin@marwaribasket.com');
    console.log('- Password: adminpass');
    console.log('- Role: admin');
    console.log('- Hashed password:', admin.password);
    
    // Test the password
    const match = await admin.matchPassword('adminpass');
    console.log('- Password match:', match);
    
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createAdminSimple(); 