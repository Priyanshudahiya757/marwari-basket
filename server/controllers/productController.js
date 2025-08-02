const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products with filtering and pagination
exports.getAllProducts = async (req, res) => {
  try {
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
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('createdBy', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate unique SKU
const generateSKU = async (name) => {
  const prefix = name.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const sku = `${prefix}${timestamp}`;
  const exists = await Product.findOne({ sku });
  return exists ? generateSKU(name) : sku;
};

// Create a new product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, images, stock, category, status, seo, availableFrom, availableTo, flashSale } = req.body;
    
    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) return res.status(400).json({ message: 'Category not found' });
    
    // Generate SKU
    const sku = await generateSKU(name);
    
    const product = new Product({
      name,
      sku,
      price,
      description,
      images: images || [],
      stock,
      category,
      status,
      seo,
      availableFrom,
      availableTo,
      flashSale,
      createdBy: req.user._id
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const { name, price, description, images, stock, category, status, seo, availableFrom, availableTo, flashSale } = req.body;
    
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) return res.status(400).json({ message: 'Category not found' });
      product.category = category;
    }
    
    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description || product.description;
    product.images = images || product.images;
    product.stock = stock !== undefined ? stock : product.stock;
    product.status = status || product.status;
    product.seo = seo || product.seo;
    product.availableFrom = availableFrom || product.availableFrom;
    product.availableTo = availableTo || product.availableTo;
    product.flashSale = flashSale || product.flashSale;
    
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
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