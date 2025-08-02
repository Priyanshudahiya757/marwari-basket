// users.js - Seed script for sample users
// Run with: node seed/users.js

const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
  { name: 'Demo User', email: 'demo@marwaribasket.com', password: 'password123' },
  { name: 'Admin User', email: 'admin@marwaribasket.com', password: 'adminpass', isAdmin: true },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwari-basket');
  await User.deleteMany({});
  await User.insertMany(users);
  console.log('Seeded users!');
  process.exit();
}

seed(); 