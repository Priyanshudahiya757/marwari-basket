const Product = require('../models/Product');
const Category = require('../models/Category');
const { ensureConnection } = require('../config/db');

// Get all products with filtering and pagination
exports.getAllProducts = async (req, res) => {
  try {
    console.log('📦 Fetching products with filters:', req.query);
    
    // Ensure database connection
    const dbConnected = await ensureConnection();
    if (!dbConnected) {
      console.error('❌ Database not connected during product fetch');
      return res.status(503).json({ message: 'Service temporarily unavailable' });
    }
    
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('createdBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    console.log(`✅ Fetched ${products.length} products out of ${total} total`);
    
    res.json({
      products: products || [],
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total: total || 0
    });
  } catch (error) {
    console.error('❌ Product fetch error:', error.message);
    res.status(500).json({ message: 'Failed to fetch products. Please try again.' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    console.log('📦 Fetching product by ID:', req.params.id);
    
    // Ensure database connection
    const dbConnected = await ensureConnection();
    if (!dbConnected) {
      console.error('❌ Database not connected during product fetch');
      return res.status(503).json({ message: 'Service temporarily unavailable' });
    }
    
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('createdBy', 'name');
      
    if (!product) {
      console.log('❌ Product not found:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('✅ Product fetched successfully:', product.name);
    res.json(product);
  } catch (error) {
    console.error('❌ Product fetch error:', error.message);
    res.status(500).json({ message: 'Failed to fetch product. Please try again.' });
  }
};

// Generate unique SKU
const generateSKU = async (name) => {
  try {
    const prefix = name.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const sku = `${prefix}${timestamp}`;
    const exists = await Product.findOne({ sku });
    return exists ? generateSKU(name) : sku;
  } catch (error) {
    console.error('❌ SKU generation error:', error.message);
    throw new Error('Failed to generate SKU');
  }
};

// Create a new product (admin only)
exports.createProduct = async (req, res) => {
  try {
    console.log('📦 Creating new product:', req.body.name);
    
    // Ensure database connection
    const dbConnected = await ensureConnection();
    if (!dbConnected) {
      console.error('❌ Database not connected during product creation');
      return res.status(503).json({ message: 'Service temporarily unavailable' });
    }
    
    const { name, price, description, images, stock, category, status, seo, availableFrom, availableTo, flashSale } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    
    // Validate category exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }
    
    // Generate SKU
    const sku = await generateSKU(name);
    
    const product = new Product({
      name,
      sku,
      price,
      description,
      images: images || [],
      stock: stock || 0,
      category,
      status: status || 'active',
      seo,
      availableFrom,
      availableTo,
      flashSale,
      createdBy: req.user?._id
    });
    
    await product.save();
    console.log('✅ Product created successfully:', product.name);
    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Product creation error:', error.message);
    res.status(500).json({ message: 'Failed to create product. Please try again.' });
  }
};

// Update a product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    console.log('📦 Updating product:', req.params.id);
    
    // Ensure database connection
    const dbConnected = await ensureConnection();
    if (!dbConnected) {
      console.error('❌ Database not connected during product update');
      return res.status(503).json({ message: 'Service temporarily unavailable' });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log('❌ Product not found for update:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    console.log('✅ Product updated successfully:', updatedProduct.name);
    res.json(updatedProduct);
  } catch (error) {
    console.error('❌ Product update error:', error.message);
    res.status(500).json({ message: 'Failed to update product. Please try again.' });
  }
};

// Delete a product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk upload products (admin only)
exports.bulkUpload = async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products array is required' });
    }
    
    const results = [];
    for (const productData of products) {
      try {
        const { name, price, description, stock, category } = productData;
        
        // Validate category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          results.push({ name, error: 'Category not found' });
          continue;
        }
        
        // Generate SKU
        const sku = await generateSKU(name);
        
        const product = new Product({
          name,
          sku,
          price,
          description,
          stock,
          category,
          createdBy: req.user._id
        });
        
        await product.save();
        results.push({ name, success: true, id: product._id });
      } catch (error) {
        results.push({ name: productData.name, error: error.message });
      }
    }
    
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle product status (admin only)
exports.toggleStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    product.status = product.status === 'active' ? 'inactive' : 'active';
    await product.save();
    
    res.json({ message: `Product ${product.status}`, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock products (admin only)
exports.getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    const products = await Product.find({ stock: { $lte: threshold } })
      .populate('category', 'name')
      .sort({ stock: 1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 