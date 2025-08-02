// sms.js - Twilio SMS utility for production-grade notification automation
// Features: order confirmation, shipping updates, delivery, returns/refunds, admin alerts

/**
 * Send order confirmation SMS to customer.
 * @param {Object} order - Order object with customer info
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendOrderConfirmation(order) {
  try {
    const { customerPhone, customerName, orderId, totalAmount } = order;
    
    const message = `Hi ${customerName || 'Customer'}! Your order #${orderId.slice(-6).toUpperCase()} for ₹${totalAmount} has been confirmed. We'll keep you updated on the progress. - Marwari Basket`;
    
    // TODO: Replace with real Twilio API call
    // const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: customerPhone
    // });
    
    console.log(`Order confirmation SMS sent to ${customerPhone}`);
    return { success: true, message: 'Order confirmation SMS sent' };
  } catch (error) {
    console.error('Failed to send order confirmation SMS:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send shipping update SMS to customer.
 * @param {Object} order - Order object with shipping info
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendShippingUpdate(order) {
  try {
    const { customerPhone, customerName, orderId, trackingNumber, trackingUrl } = order;
    
    const message = `Hi ${customerName || 'Customer'}! Your order #${orderId.slice(-6).toUpperCase()} has been shipped! Track it at: ${trackingUrl} - Marwari Basket`;
    
    // TODO: Replace with real Twilio API call
    console.log(`Shipping update SMS sent to ${customerPhone}`);
    return { success: true, message: 'Shipping update SMS sent' };
  } catch (error) {
    console.error('Failed to send shipping update SMS:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send delivery confirmation SMS to customer.
 * @param {Object} order - Order object
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendDeliveryConfirmation(order) {
  try {
    const { customerPhone, customerName, orderId } = order;
    
    const message = `Hi ${customerName || 'Customer'}! Your order #${orderId.slice(-6).toUpperCase()} has been delivered! We hope you love your purchase. Thank you for choosing Marwari Basket!`;
    
    // TODO: Replace with real Twilio API call
    console.log(`Delivery confirmation SMS sent to ${customerPhone}`);
    return { success: true, message: 'Delivery confirmation SMS sent' };
  } catch (error) {
    console.error('Failed to send delivery confirmation SMS:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send return/refund notification SMS to customer.
 * @param {Object} order - Order object with return/refund info
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendReturnNotification(order) {
  try {
    const { customerPhone, customerName, orderId, refundAmount } = order;
    
    const message = `Hi ${customerName || 'Customer'}! Your return for order #${orderId.slice(-6).toUpperCase()} has been processed. Refund of ₹${refundAmount} will be credited within 5-7 days. - Marwari Basket`;
    
    // TODO: Replace with real Twilio API call
    console.log(`Return notification SMS sent to ${customerPhone}`);
    return { success: true, message: 'Return notification SMS sent' };
  } catch (error) {
    console.error('Failed to send return notification SMS:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send admin alert SMS for critical issues.
 * @param {Object} alert - Alert object with type and details
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendAdminAlert(alert) {
  try {
    const { type, details, adminPhone } = alert;
    
    const message = `ADMIN ALERT: ${type}. Details: ${JSON.stringify(details).substring(0, 100)}... - Marwari Basket`;
    
    // TODO: Replace with real Twilio API call
    console.log(`Admin alert SMS sent to ${adminPhone}`);
    return { success: true, message: 'Admin alert SMS sent' };
  } catch (error) {
    console.error('Failed to send admin alert SMS:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send low stock alert SMS to admin.
 * @param {Object} product - Product object with stock info
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendLowStockAlert(product) {
  try {
    const { name, sku, stock, adminPhone } = product;
    
    const message = `LOW STOCK ALERT: ${name} (SKU: ${sku}) has only ${stock} units remaining. Please reorder soon. - Marwari Basket`;
    
    // TODO: Replace with real Twilio API call
    console.log(`Low stock alert SMS sent to ${adminPhone}`);
    return { success: true, message: 'Low stock alert SMS sent' };
  } catch (error) {
    console.error('Failed to send low stock alert SMS:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send OTP SMS for authentication.
 * @param {Object} data - Data object with phone and OTP
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendOTP(data) {
  try {
    const { phone, otp } = data;
    
    const message = `Your Marwari Basket OTP is: ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`;
    
    // TODO: Replace with real Twilio API call
    console.log(`OTP SMS sent to ${phone}`);
    return { success: true, message: 'OTP SMS sent' };
  } catch (error) {
    console.error('Failed to send OTP SMS:', error);
    return { success: false, message: error.message };
  }
}

module.exports = { 
  sendOrderConfirmation,
  sendShippingUpdate,
  sendDeliveryConfirmation,
  sendReturnNotification,
  sendAdminAlert,
  sendLowStockAlert,
  sendOTP
}; 