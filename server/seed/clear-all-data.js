const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const OTP = require('../models/OTP');
require('dotenv').config();

async function clearAllData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwari-basket');
    console.log('Connected to MongoDB');
    console.log('🗑️ Clearing all data...');
    
    await User.deleteMany({});
    console.log('✅ Users cleared');
    
    await Product.deleteMany({});
    console.log('✅ Products cleared');
    
    await Category.deleteMany({});
    console.log('✅ Categories cleared');
    
    await Order.deleteMany({});
    console.log('✅ Orders cleared');
    
    await OTP.deleteMany({});
    console.log('✅ OTP records cleared');
    
    console.log('\n🎉 All data cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
}

clearAllData(); 