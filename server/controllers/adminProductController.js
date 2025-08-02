const Product = require('../models/Product');
const Category = require('../models/Category');
const { uploadToCloudinary } = require('../utils/upload');

// Get all products with pagination and filtering
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status !== undefined) {
      query.isActive = status === 'true';
    }
    
    const products = await Product.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, seoTitle, seoDescription, isActive } = req.body;
    
    // Validate required fields
    if (!name || !price || !stock) {
      return res.status(400).json({ message: 'Name, price, and stock are required' });
    }
    
    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);
        images.push(result.secure_url);
      }
    }
    
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      images,
      seoTitle,
      seoDescription,
      isActive: isActive !== 'false'
    });
    
    await product.save();
    res.status(201).json({ product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, seoTitle, seoDescription, isActive } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Handle image uploads
    let images = product.images || [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);
        images.push(result.secure_url);
      }
    }
    
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? parseFloat(price) : product.price;
    product.category = category || product.category;
    product.stock = stock ? parseInt(stock) : product.stock;
    product.images = images;
    product.seoTitle = seoTitle || product.seoTitle;
    product.seoDescription = seoDescription || product.seoDescription;
    product.isActive = isActive !== undefined ? isActive !== 'false' : product.isActive;
    
    await product.save();
    res.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// Bulk actions
exports.bulkAction = async (req, res) => {
  try {
    const { action, productIds } = req.body;
    
    if (!action || !productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    
    switch (action) {
      case 'activate':
        await Product.updateMany(
          { _id: { $in: productIds } },
          { isActive: true }
        );
        break;
      case 'deactivate':
        await Product.updateMany(
          { _id: { $in: productIds } },
          { isActive: false }
        );
        break;
      case 'delete':
        await Product.deleteMany({ _id: { $in: productIds } });
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    
    res.json({ message: `Bulk action '${action}' completed successfully` });
  } catch (error) {
    console.error('Error performing bulk action:', error);
    res.status(500).json({ message: 'Error performing bulk action' });
  }
};

// Get product statistics
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    
    res.json({
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts
    });
  } catch (error) {
    console.error('Error fetching product stats:', error);
    res.status(500).json({ message: 'Error fetching product statistics' });
  }
}; 