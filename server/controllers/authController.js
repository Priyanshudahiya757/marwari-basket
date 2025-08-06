// Auth Controller for JWT-based authentication
// Features: registration, login, password reset, email notifications

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendOrderConfirmation } = require('../utils/email');
const bcrypt = require('bcryptjs');
const { ensureConnection } = require('../config/db');

// Helper: Generate JWT with comprehensive error handling
function generateToken(user) {
  try {
    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not defined');
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    
    // Validate user object
    if (!user || !user._id || !user.email) {
      console.error('❌ Invalid user object for token generation:', user);
      throw new Error('Invalid user object for token generation');
    }
    
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role || 'customer',
      isAdmin: user.isAdmin || false
    };
    
    console.log('🔐 Generating JWT token for user:', user.email);
    
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { 
      expiresIn: '7d',
      issuer: 'marwari-basket',
      audience: 'marwari-basket-users'
    });
    
    console.log('✅ JWT token generated successfully');
    return token;
  } catch (error) {
    console.error('❌ JWT token generation failed:', error.message);
    if (error.message.includes('JWT_SECRET')) {
      throw new Error('Authentication service configuration error');
    }
    throw new Error('Authentication service unavailable');
  }
}

// Registration
exports.register = async (req, res) => {
  try {
    console.log('📝 Registration attempt:', { email: req.body.email, phone: req.body.phone });
    
    // Ensure database connection
    const dbConnected = await ensureConnection();
    if (!dbConnected) {
      console.error('❌ Database not connected during registration');
      return res.status(503).json({ message: 'Service temporarily unavailable' });
    }
    
    const { name, email, phone, password, confirmPassword, terms } = req.body;
    if (!name || !email || !phone || !password || !confirmPassword || !terms) {
      return res.status(400).json({ message: 'All fields required' });
    }
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ message: 'Invalid email' });
    if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ message: 'Invalid phone' });
    if (password.length < 6) return res.status(400).json({ message: 'Password too short' });
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    
    const user = await User.create({ name, email, phone, password });
    console.log('✅ User registered successfully:', user.email);
    
    // Send welcome email (optional)
    try {
      const welcomeResult = await sendWelcomeEmail({ email, name });
      if (!welcomeResult.success) {
        console.warn('⚠️ Failed to send welcome email:', welcomeResult.message);
      }
    } catch (emailError) {
      console.warn('⚠️ Email service error:', emailError.message);
    }
    
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name, email, phone } });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

// Login with comprehensive error handling
exports.login = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', { emailOrMobile: req.body.emailOrMobile });
    
    // Validate request body
    const { emailOrMobile, password } = req.body;
    if (!emailOrMobile || !password) {
      console.log('❌ Login failed: Missing email/mobile or password');
      return res.status(400).json({ message: 'Email/Mobile and password required' });
    }
    
    // Check JWT_SECRET before proceeding
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not defined');
      return res.status(503).json({ message: 'Authentication service unavailable' });
    }
    
    // Ensure database connection
    console.log('🔌 Ensuring database connection...');
    const dbConnected = await ensureConnection();
    if (!dbConnected) {
      console.error('❌ Database not connected during login');
      return res.status(503).json({ message: 'Service temporarily unavailable' });
    }
    console.log('✅ Database connected successfully');
    
    // Find user by email or phone
    console.log('🔍 Searching for user...');
    const user = await User.findOne({
      $or: [
        { email: emailOrMobile.toLowerCase() },
        { phone: emailOrMobile }
      ]
    });
    
    if (!user) {
      console.log('❌ Login failed: User not found for:', emailOrMobile);
      return res.status(401).json({ message: 'Invalid email/mobile or password' });
    }
    
    console.log('✅ User found:', user.email);
    
    // Verify password
    console.log('🔐 Verifying password...');
    const match = await user.matchPassword(password);
    if (!match) {
      console.log('❌ Login failed: Invalid password for user:', user.email);
      return res.status(401).json({ message: 'Invalid email/mobile or password' });
    }
    
    console.log('✅ Password verified successfully');
    
    // Generate JWT token
    console.log('🔐 Generating authentication token...');
    const token = generateToken(user);
    
    console.log('✅ Login successful:', user.email);
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        role: user.role || 'customer',
        isAdmin: user.isAdmin || false
      } 
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    console.error('❌ Error stack:', err.stack);
    
    // Return appropriate error message based on error type
    if (err.message.includes('JWT_SECRET')) {
      return res.status(503).json({ message: 'Authentication service configuration error' });
    }
    if (err.message.includes('Database not connected')) {
      return res.status(503).json({ message: 'Service temporarily unavailable' });
    }
    
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    console.log('🔑 Forgot password attempt:', { email: req.body.email });
    
    // Ensure database connection
    const dbConnected = await ensureConnection();
    if (!dbConnected) {
      console.error('❌ Database not connected during forgot password');
      return res.status(503).json({ message: 'Service temporarily unavailable' });
    }
    
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
    await user.save();
    
    // Send reset email (optional)
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
      const resetEmailResult = await sendOrderConfirmation({ 
        customerEmail: email, 
        name: user.name, 
        reset: true, 
        resetUrl 
      });
      
      if (!resetEmailResult.success) {
        console.warn('⚠️ Failed to send password reset email:', resetEmailResult.message);
      }
    } catch (emailError) {
      console.warn('⚠️ Email service error:', emailError.message);
    }
    
    console.log('✅ Password reset email sent to:', email);
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('❌ Forgot password error:', err.message);
    res.status(500).json({ message: 'Password reset failed. Please try again.' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    console.log('🔄 Password reset attempt');
    
    // Ensure database connection
    const dbConnected = await ensureConnection();
    if (!dbConnected) {
      console.error('❌ Database not connected during password reset');
      return res.status(503).json({ message: 'Service temporarily unavailable' });
    }
    
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields required' });
    }
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    if (password.length < 6) return res.status(400).json({ message: 'Password too short' });
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ 
      resetPasswordToken: hashedToken, 
      resetPasswordExpires: { $gt: Date.now() } 
    });
    
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    console.log('✅ Password reset successful for:', user.email);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('❌ Password reset error:', err.message);
    res.status(500).json({ message: 'Password reset failed. Please try again.' });
  }
}; 