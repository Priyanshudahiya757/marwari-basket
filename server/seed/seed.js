const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

// Sample categories
const categories = [
  { name: 'Clothing', slug: 'clothing', description: 'Traditional Rajasthani clothing' },
  { name: 'Jewelry', slug: 'jewelry', description: 'Handcrafted jewelry and accessories' },
  { name: 'Home Decor', slug: 'home-decor', description: 'Beautiful home decoration items' },
  { name: 'Textiles', slug: 'textiles', description: 'Traditional fabrics and textiles' },
  { name: 'Crafts', slug: 'crafts', description: 'Handmade crafts and artifacts' }
];

// Sample products
const products = [
  {
    name: 'Traditional Rajasthani Lehenga',
    description: 'Beautiful handcrafted lehenga with intricate embroidery',
    price: 4500,
    category: 'Clothing',
    images: ['https://via.placeholder.com/400x500/FF6B6B/FFFFFF?text=Lehenga'],
    stock: 25,
    sku: 'LEH001',
    features: ['Handcrafted', 'Traditional Design', 'Premium Quality'],
    specifications: {
      material: 'Silk',
      color: 'Red & Gold',
      size: 'Free Size'
    }
  },
  {
    name: 'Silver Kundan Necklace',
    description: 'Elegant silver necklace with kundan work',
    price: 2800,
    category: 'Jewelry',
    images: ['https://via.placeholder.com/400x500/4ECDC4/FFFFFF?text=Necklace'],
    stock: 15,
    sku: 'JEW001',
    features: ['Silver Plated', 'Kundan Work', 'Traditional Design'],
    specifications: {
      material: 'Silver Plated',
      color: 'Silver',
      length: '18 inches'
    }
  },
  {
    name: 'Handcrafted Pottery Vase',
    description: 'Beautiful handcrafted pottery vase with traditional designs',
    price: 1200,
    category: 'Home Decor',
    images: ['https://via.placeholder.com/400x500/45B7D1/FFFFFF?text=Vase'],
    stock: 30,
    sku: 'DEC001',
    features: ['Handcrafted', 'Traditional Design', 'Eco-friendly'],
    specifications: {
      material: 'Clay',
      color: 'Terracotta',
      height: '12 inches'
    }
  },
  {
    name: 'Bandhani Silk Saree',
    description: 'Traditional bandhani silk saree with beautiful patterns',
    price: 3500,
    category: 'Textiles',
    images: ['https://via.placeholder.com/400x500/96CEB4/FFFFFF?text=Saree'],
    stock: 20,
    sku: 'TEX001',
    features: ['Bandhani Work', 'Pure Silk', 'Traditional Design'],
    specifications: {
      material: 'Silk',
      color: 'Blue & White',
      length: '6 yards'
    }
  },
  {
    name: 'Handcrafted Wooden Box',
    description: 'Beautiful handcrafted wooden box with traditional carvings',
    price: 800,
    category: 'Crafts',
    images: ['https://via.placeholder.com/400x500/FFEAA7/FFFFFF?text=Wooden+Box'],
    stock: 40,
    sku: 'CRA001',
    features: ['Handcrafted', 'Wooden', 'Traditional Carvings'],
    specifications: {
      material: 'Wood',
      color: 'Natural Wood',
      size: '8x6x4 inches'
    }
  },
  {
    name: 'Embroidered Kurti',
    description: 'Beautiful embroidered kurti with traditional motifs',
    price: 1800,
    category: 'Clothing',
    images: ['https://via.placeholder.com/400x500/DDA0DD/FFFFFF?text=Kurti'],
    stock: 35,
    sku: 'LEH002',
    features: ['Hand Embroidered', 'Cotton', 'Comfortable Fit'],
    specifications: {
      material: 'Cotton',
      color: 'Pink',
      size: 'M'
    }
  }
];

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@marwaribasket.com',
    phone: '9876543210',
    password: 'admin123',
    role: 'admin',
    isAdmin: true
  },
  {
    name: 'Test Customer',
    email: 'customer@example.com',
    phone: '9876543211',
    password: 'customer123',
    role: 'customer',
    addressBook: [
      {
        name: 'Home',
        phone: '9876543211',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwari-basket');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories created:', createdCategories.length);

    // Create products with category references
    const productsWithCategories = products.map(product => {
      const category = createdCategories.find(cat => cat.name === product.category);
      return {
        ...product,
        category: category._id
      };
    });

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log('Products created:', createdProducts.length);

    // Create users with hashed passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Users created:', createdUsers.length);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@marwaribasket.com / admin123');
    console.log('Customer: customer@example.com / customer123');
    console.log('\n🔗 Access the application at: http://localhost:5173');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 