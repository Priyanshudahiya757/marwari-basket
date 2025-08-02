const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
}, { _id: false });

const commLogSchema = new mongoose.Schema({
  type: { type: String, enum: ['email', 'sms', 'call', 'note'], required: true },
  message: String,
  date: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer' }, // Role-based access
  isAdmin: { type: Boolean, default: false }, // For legacy compatibility
  status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' }, // Customer status
  segment: { type: String, enum: ['New', 'Regular', 'VIP'], default: 'New' }, // Customer segment
  addressBook: [addressSchema], // Multiple addresses
  commLogs: [commLogSchema], // Communication logs
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 