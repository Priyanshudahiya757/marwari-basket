const mongoose = require('mongoose');

// Status history subdocument
const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
  note: String
}, { _id: false });

// Address subdocument
const addressSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // allow guest checkout
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: Number, // snapshot price
      sku: String, // snapshot SKU
      name: String, // snapshot name
    },
  ],
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  shippingMethod: { type: String, default: 'standard' },
  trackingNumber: String,
  carrier: String,
  statusHistory: [statusHistorySchema],
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'packed', 'shipped', 'delivered', 'returned', 'cancelled', 'refunded'],
    default: 'pending',
  },
  payment: {
    method: { type: String, enum: ['cod', 'card', 'upi'], default: 'cod' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: String
  },
  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  trackingUrl: String,
  customerEmail: String,
  customerPhone: String,
  feedbackRequested: { type: Boolean, default: false },
  // Returns & Refunds
  returnRequested: { type: Boolean, default: false },
  returnReason: String,
  refundStatus: { type: String, enum: ['none', 'pending', 'processed'], default: 'none' },
  refundAmount: Number,
  // Packing slip/label
  packingSlipUrl: String,
  shippingLabelUrl: String,
  // Batch fulfillment
  batchId: String, // For batch operations
}, {
  timestamps: { createdAt: true, updatedAt: true },
});

module.exports = mongoose.model('Order', orderSchema); 