// Auth Controller for JWT-based authentication
// Features: registration, login, password reset, email notifications

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendOrderConfirmation } = require('../utils/email');
const bcrypt = require('bcryptjs');

// Helper: Generate JWT
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Registration
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, terms } = req.body;
    if (!name || !email || !phone || !password || !confirmPassword || !terms) return res.status(400).json({ message: 'All fields required' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ message: 'Invalid email' });
    if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ message: 'Invalid phone' });
    if (password.length < 6) return res.status(400).json({ message: 'Password too short' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, phone, password });
    
    // Send welcome email
    const welcomeResult = await sendWelcomeEmail({ email, name });
    if (!welcomeResult.success) {
      console.warn('Failed to send welcome email:', welcomeResult.message);
    }
    
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name, email, phone } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
    await user.save();
    
    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const resetEmailResult = await sendOrderConfirmation({ 
      customerEmail: email, 
      name: user.name, 
      reset: true, 
      resetUrl 
    });
    
    if (!resetEmailResult.success) {
      console.warn('Failed to send password reset email:', resetEmailResult.message);
    }
    
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || !confirmPassword) return res.status(400).json({ message: 'All fields required' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    if (password.length < 6) return res.status(400).json({ message: 'Password too short' });
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 