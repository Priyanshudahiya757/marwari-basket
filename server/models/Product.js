const mongoose = require('mongoose');

// Product schema definition for advanced admin panel
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  }, // Stock Keeping Unit
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  cost: {
    type: Number,
    default: 0,
    min: 0,
  }, // Cost price for margin calculation
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String, // URL or file path
    required: true,
  }], // Support multiple images
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0,
  }, // For inventory tracking
  minStock: {
    type: Number,
    default: 5,
    min: 0,
  }, // Minimum stock threshold
  maxStock: {
    type: Number,
    default: 100,
    min: 0,
  }, // Maximum stock threshold
  supplier: {
    type: String,
    default: 'Unknown',
  }, // Supplier name or ID
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }, // Product status
  seo: {
    title: String,
    description: String,
    keywords: [String],
  }, // SEO metadata
  availableFrom: Date, // Scheduled availability
  availableTo: Date, // Scheduled end
  flashSale: {
    isActive: { type: Boolean, default: false },
    price: Number,
    start: Date,
    end: Date,
  }, // Flash sale info
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }, // For audit
}, {
  timestamps: { createdAt: true, updatedAt: true },
});

module.exports = mongoose.model('Product', productSchema); 