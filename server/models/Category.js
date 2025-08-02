const mongoose = require('mongoose');

// Category schema for product/category management
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  }, // For URLs
  description: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  }, // For nested categories
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
  },
}, {
  timestamps: { createdAt: true, updatedAt: true },
});

module.exports = mongoose.model('Category', categorySchema); 