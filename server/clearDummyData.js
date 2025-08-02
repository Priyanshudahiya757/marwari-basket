require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Category = require('./models/Category');

async function clearData() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Category.deleteMany({});
  console.log('All data cleared!');
  process.exit(0);
}

clearData().catch(err => {
  console.error(err);
  process.exit(1);
}); 