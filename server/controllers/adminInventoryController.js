const Product = require('../models/Product');
const User = require('../models/User');

// Get inventory with stock levels and alerts
const getInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', stockLevel = '' } = req.query;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    // Add stock status to each product
    const inventoryWithStatus = products.map(product => {
      let status = 'in-stock';
      if (product.stockQuantity === 0) {
        status = 'out-of-stock';
      } else if (product.stockQuantity <= (product.minStock || 5)) {
        status = 'low-stock';
      }
      
      return {
        id: product._id,
        name: product.name,
        sku: product.sku || `SKU-${product._id.toString().slice(-6)}`,
        category: product.category,
        currentStock: product.stockQuantity || 0,
        minStock: product.minStock || 5,
        maxStock: product.maxStock || 100,
        supplier: product.supplier || 'Unknown',
        cost: product.cost || 0,
        price: product.price,
        status,
        lastUpdated: product.updatedAt
      };
    });
    
    res.json({
      inventory: inventoryWithStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Error fetching inventory' });
  }
};

// Get stock alerts
const getStockAlerts = async (req, res) => {
  try {
    const products = await Product.find({});
    
    const alerts = [];
    
    products.forEach(product => {
      const currentStock = product.stockQuantity || 0;
      const minStock = product.minStock || 5;
      
      if (currentStock === 0) {
        // Out of stock
        alerts.push({
          id: product._id,
          type: 'out-of-stock',
          product: {
            id: product._id,
            name: product.name,
            sku: product.sku || `SKU-${product._id.toString().slice(-6)}`,
            category: product.category
          },
          currentStock,
          minStock,
          supplier: product.supplier || 'Unknown',
          daysSinceStockout: Math.floor((Date.now() - product.updatedAt) / (1000 * 60 * 60 * 24)),
          priority: 'critical',
          lastUpdated: product.updatedAt
        });
      } else if (currentStock <= minStock) {
        // Low stock
        const daysUntilStockout = Math.ceil(currentStock / 2); // Rough estimate
        alerts.push({
          id: product._id,
          type: 'low-stock',
          product: {
            id: product._id,
            name: product.name,
            sku: product.sku || `SKU-${product._id.toString().slice(-6)}`,
            category: product.category
          },
          currentStock,
          minStock,
          supplier: product.supplier || 'Unknown',
          daysUntilStockout,
          priority: daysUntilStockout <= 3 ? 'high' : 'medium',
          lastUpdated: product.updatedAt
        });
      }
    });
    
    res.json({ alerts });
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    res.status(500).json({ message: 'Error fetching stock alerts' });
  }
};

// Update stock levels
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, type = 'add' } = req.body;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let newStock;
    if (type === 'add') {
      newStock = (product.stockQuantity || 0) + parseInt(quantity);
    } else if (type === 'subtract') {
      newStock = Math.max(0, (product.stockQuantity || 0) - parseInt(quantity));
    } else {
      newStock = parseInt(quantity);
    }
    
    product.stockQuantity = newStock;
    await product.save();
    
    res.json({ 
      message: 'Stock updated successfully',
      product: {
        id: product._id,
        name: product.name,
        stockQuantity: product.stockQuantity
      }
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Error updating stock' });
  }
};

// Bulk stock update
const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { productId, quantity, type }
    
    const results = [];
    
    for (const update of updates) {
      const product = await Product.findById(update.productId);
      if (product) {
        let newStock;
        if (update.type === 'add') {
          newStock = (product.stockQuantity || 0) + parseInt(update.quantity);
        } else if (update.type === 'subtract') {
          newStock = Math.max(0, (product.stockQuantity || 0) - parseInt(update.quantity));
        } else {
          newStock = parseInt(update.quantity);
        }
        
        product.stockQuantity = newStock;
        await product.save();
        
        results.push({
          productId: product._id,
          name: product.name,
          newStock: product.stockQuantity,
          success: true
        });
      } else {
        results.push({
          productId: update.productId,
          success: false,
          error: 'Product not found'
        });
      }
    }
    
    res.json({ 
      message: 'Bulk stock update completed',
      results
    });
  } catch (error) {
    console.error('Error performing bulk stock update:', error);
    res.status(500).json({ message: 'Error performing bulk stock update' });
  }
};

// Get suppliers
const getSuppliers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    // Build query - for now, we'll use a mock approach since we don't have a Supplier model
    // In a real implementation, you'd have a separate Supplier model
    let query = { role: 'supplier' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // For now, return mock data
    const mockSuppliers = [
      {
        id: 1,
        name: 'Rajasthan Textiles',
        contactPerson: 'Rajesh Mehta',
        email: 'rajesh@rajasthantextiles.com',
        phone: '+91 98765 43210',
        address: 'Jaipur, Rajasthan',
        category: 'Textiles',
        status: 'active',
        rating: 4.5,
        totalOrders: 45,
        totalSpent: 250000,
        lastOrder: '2024-01-15',
        paymentTerms: 'Net 30',
        leadTime: '7-10 days'
      },
      {
        id: 2,
        name: 'Jaipur Crafts',
        contactPerson: 'Priya Sharma',
        email: 'priya@jaipurcrafts.com',
        phone: '+91 87654 32109',
        address: 'Jaipur, Rajasthan',
        category: 'Handicrafts',
        status: 'active',
        rating: 4.2,
        totalOrders: 32,
        totalSpent: 180000,
        lastOrder: '2024-01-12',
        paymentTerms: 'Net 45',
        leadTime: '10-15 days'
      }
    ];
    
    res.json({
      suppliers: mockSuppliers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: 1,
        totalSuppliers: mockSuppliers.length,
        hasNextPage: false,
        hasPrevPage: false
      }
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Error fetching suppliers' });
  }
};

// Generate purchase order
const generatePurchaseOrder = async (req, res) => {
  try {
    const { supplierId, items } = req.body;
    
    // Mock PO generation
    const poNumber = `PO-${Date.now()}`;
    const purchaseOrder = {
      poNumber,
      supplierId,
      items,
      totalAmount: items.reduce((sum, item) => sum + (item.quantity * item.cost), 0),
      status: 'pending',
      createdAt: new Date(),
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
    
    res.json({ 
      message: 'Purchase order generated successfully',
      purchaseOrder
    });
  } catch (error) {
    console.error('Error generating purchase order:', error);
    res.status(500).json({ message: 'Error generating purchase order' });
  }
};

// Get inventory reports
const getInventoryReports = async (req, res) => {
  try {
    const { reportType = 'summary' } = req.query;
    
    const products = await Product.find({});
    
    let report;
    
    switch (reportType) {
      case 'summary':
        const totalProducts = products.length;
        const outOfStock = products.filter(p => (p.stockQuantity || 0) === 0).length;
        const lowStock = products.filter(p => (p.stockQuantity || 0) <= (p.minStock || 5)).length;
        const totalValue = products.reduce((sum, p) => sum + ((p.stockQuantity || 0) * (p.cost || 0)), 0);
        
        report = {
          totalProducts,
          outOfStock,
          lowStock,
          inStock: totalProducts - outOfStock - lowStock,
          totalValue,
          averageStock: products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0) / totalProducts
        };
        break;
        
      case 'category':
        const categoryStats = {};
        products.forEach(product => {
          const category = product.category || 'Uncategorized';
          if (!categoryStats[category]) {
            categoryStats[category] = {
              count: 0,
              totalStock: 0,
              totalValue: 0
            };
          }
          categoryStats[category].count++;
          categoryStats[category].totalStock += product.stockQuantity || 0;
          categoryStats[category].totalValue += (product.stockQuantity || 0) * (product.cost || 0);
        });
        report = { categoryStats };
        break;
        
      default:
        report = { message: 'Report type not supported' };
    }
    
    res.json({ report });
  } catch (error) {
    console.error('Error generating inventory report:', error);
    res.status(500).json({ message: 'Error generating inventory report' });
  }
};

module.exports = {
  getInventory,
  getStockAlerts,
  updateStock,
  bulkUpdateStock,
  getSuppliers,
  generatePurchaseOrder,
  getInventoryReports
}; 