const User = require('../models/User');
const Order = require('../models/Order');

// Get all customers with search, filter, and pagination
const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', segment = '' } = req.query;
    
    // Build query
    let query = { role: 'user' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (segment && segment !== 'all') {
      query.segment = segment;
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    // Get order statistics for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer._id });
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const lastOrder = orders.length > 0 ? orders[orders.length - 1].createdAt : null;
        
        return {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          status: customer.status || 'active',
          segment: customer.segment || 'Regular',
          totalOrders,
          totalSpent,
          lastOrder: lastOrder ? lastOrder.toISOString().split('T')[0] : null,
          createdAt: customer.createdAt
        };
      })
    );
    
    res.json({
      customers: customersWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCustomers: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers' });
  }
};

// Get single customer with detailed information
const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const customer = await User.findById(id).select('-password');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Get customer orders
    const orders = await Order.find({ user: id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    // Get communication history (mock data for now)
    const communications = [
      {
        id: 1,
        type: 'email',
        subject: 'Welcome to Marwari Basket!',
        date: customer.createdAt,
        status: 'sent'
      }
    ];
    
    // Get customer notes (mock data for now)
    const notes = [
      {
        id: 1,
        content: 'Customer registered successfully',
        date: customer.createdAt,
        author: 'System'
      }
    ];
    
    const customerDetail = {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status || 'active',
      segment: customer.segment || 'Regular',
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      lastOrder: orders.length > 0 ? orders[orders.length - 1].createdAt : null,
      createdAt: customer.createdAt,
      orders: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        status: order.status,
        total: order.totalAmount,
        items: order.items.length
      })),
      communications,
      notes
    };
    
    res.json(customerDetail);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Error fetching customer details' });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, segment } = req.body;
    
    const customer = await User.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Update fields
    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (status) customer.status = status;
    if (segment) customer.segment = segment;
    
    await customer.save();
    
    res.json({ 
      message: 'Customer updated successfully',
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        segment: customer.segment
      }
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Error updating customer' });
  }
};

// Delete customer (soft delete)
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const customer = await User.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Soft delete by setting status to deleted
    customer.status = 'deleted';
    await customer.save();
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Error deleting customer' });
  }
};

// Bulk actions
const bulkAction = async (req, res) => {
  try {
    const { action, customerIds } = req.body;
    
    if (!customerIds || customerIds.length === 0) {
      return res.status(400).json({ message: 'No customers selected' });
    }
    
    let updateData = {};
    
    switch (action) {
      case 'activate':
        updateData = { status: 'active' };
        break;
      case 'deactivate':
        updateData = { status: 'inactive' };
        break;
      case 'delete':
        updateData = { status: 'deleted' };
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    
    const result = await User.updateMany(
      { _id: { $in: customerIds } },
      updateData
    );
    
    res.json({ 
      message: `Successfully ${action}d ${result.modifiedCount} customers`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error performing bulk action:', error);
    res.status(500).json({ message: 'Error performing bulk action' });
  }
};

// Add customer note
const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const customer = await User.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // For now, we'll just return success
    // In a real implementation, you'd store notes in a separate collection
    res.json({ 
      message: 'Note added successfully',
      note: {
        id: Date.now(),
        content,
        date: new Date(),
        author: 'Admin'
      }
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Error adding note' });
  }
};

// Export customers
const exportCustomers = async (req, res) => {
  try {
    const { customerIds } = req.query;
    
    let query = { role: 'user' };
    if (customerIds) {
      query._id = { $in: customerIds.split(',') };
    }
    
    const customers = await User.find(query).select('-password');
    
    // Format data for CSV export
    const csvData = customers.map(customer => ({
      Name: customer.name,
      Email: customer.email,
      Phone: customer.phone,
      Status: customer.status || 'active',
      Segment: customer.segment || 'Regular',
      'Created At': customer.createdAt.toISOString().split('T')[0]
    }));
    
    res.json({ 
      message: 'Export data ready',
      data: csvData,
      totalCustomers: customers.length
    });
  } catch (error) {
    console.error('Error exporting customers:', error);
    res.status(500).json({ message: 'Error exporting customers' });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  bulkAction,
  addNote,
  exportCustomers
}; 