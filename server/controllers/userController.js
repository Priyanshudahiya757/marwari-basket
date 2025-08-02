const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');

// Get current user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update current user's profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    
    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user.addressBook || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new address
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const { name, phone, address, city, state, pincode } = req.body;
    
    if (!user.addressBook) user.addressBook = [];
    
    user.addressBook.push({
      name,
      phone,
      address,
      city,
      state,
      pincode
    });
    
    await user.save();
    res.status(201).json(user.addressBook[user.addressBook.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const addressId = req.params.id;
    const { name, phone, address, city, state, pincode } = req.body;
    
    const addressIndex = user.addressBook.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) return res.status(404).json({ message: 'Address not found' });
    
    user.addressBook[addressIndex] = {
      ...user.addressBook[addressIndex],
      name,
      phone,
      address,
      city,
      state,
      pincode
    };
    
    await user.save();
    res.json(user.addressBook[addressIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const addressId = req.params.id;
    const addressIndex = user.addressBook.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) return res.status(404).json({ message: 'Address not found' });
    
    user.addressBook.splice(addressIndex, 1);
    await user.save();
    
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all customers (admin only)
exports.getAllCustomers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = { role: 'customer' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    
    const customers = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      customers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer by ID with order history (admin only)
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    // Get customer's order history
    const orders = await Order.find({ user: req.params.id })
      .populate('items.product', 'name sku')
      .sort({ createdAt: -1 });
    
    res.json({ customer, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer profile (admin only)
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const { name, email, phone, role, addressBook } = req.body;
    
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.role = role || customer.role;
    customer.addressBook = addressBook || customer.addressBook;
    
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add communication log (admin only)
exports.addCommLog = async (req, res) => {
  try {
    const { type, message } = req.body;
    const customer = await User.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    customer.commLogs.push({ type, message });
    await customer.save();
    
    res.json(customer.commLogs[customer.commLogs.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all staff users (admin only)
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['admin', 'staff'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create staff user (admin only)
exports.createStaff = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'User already exists' });
    
    const user = new User({
      name,
      email,
      phone,
      password,
      role: role || 'staff'
    });
    
    await user.save();
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update staff user (admin only)
exports.updateStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    
    const { name, email, phone, role } = req.body;
    
    staff.name = name || staff.name;
    staff.email = email || staff.email;
    staff.phone = phone || staff.phone;
    staff.role = role || staff.role;
    
    await staff.save();
    res.json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete staff user (admin only)
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    
    // Prevent deleting the last admin
    if (staff.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }
    
    await staff.remove();
    res.json({ message: 'Staff user removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user statistics (admin only)
exports.getUserStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalStaff = await User.countDocuments({ role: { $in: ['admin', 'staff'] } });
    const newCustomersThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    
    res.json({
      totalCustomers,
      totalStaff,
      newCustomersThisMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 