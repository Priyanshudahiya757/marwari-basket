// products.js - Seed script for sample products
// Run with: node seed/products.js

const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  { name: 'Blue Pottery Vase', price: 2499, stock: 10, description: 'Handcrafted blue pottery vase from Jaipur.' },
  { name: 'Block Print Saree', price: 4999, stock: 5, description: 'Elegant block print saree with traditional motifs.' },
  { name: 'Kundan Necklace', price: 7999, stock: 3, description: 'Exquisite kundan necklace with precious stones.' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwari-basket');
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded products!');
  process.exit();
}

seed(); 