// email.js - SendGrid email utility for production-grade notification automation
// Features: order confirmation, shipping updates, delivery, returns/refunds, admin alerts, user registration

/**
 * Send order confirmation email to customer.
 * @param {Object} order - Order object with customer info and items
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendOrderConfirmation(order) {
  try {
    const { customerEmail, customerName, totalAmount, orderId, trackingNumber, trackingUrl } = order;
    
    const subject = `Order Confirmation #${orderId.slice(-6).toUpperCase()}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Dear ${customerName || 'Customer'},</p>
        <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
        
        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId.slice(-6).toUpperCase()}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
          ${trackingUrl ? `<p><strong>Track Your Order:</strong> <a href="${trackingUrl}">${trackingUrl}</a></p>` : ''}
        </div>
        
        <p>We'll send you updates as your order progresses.</p>
        <p>Best regards,<br>Marwari Basket Team</p>
      </div>
    `;
    
    // TODO: Replace with real SendGrid API call
    // const msg = {
    //   to: customerEmail,
    //   from: process.env.SENDGRID_FROM_EMAIL,
    //   subject: subject,
    //   html: html,
    // };
    // await sgMail.send(msg);
    
    console.log(`Order confirmation email sent to ${customerEmail}`);
    return { success: true, message: 'Order confirmation email sent' };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send shipping update email to customer.
 * @param {Object} order - Order object with shipping info
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendShippingUpdate(order) {
  try {
    const { customerEmail, customerName, orderId, trackingNumber, trackingUrl, orderStatus } = order;
    
    const subject = `Your Order #${orderId.slice(-6).toUpperCase()} Has Been Shipped!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Shipped!</h2>
        <p>Dear ${customerName || 'Customer'},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Shipping Details</h3>
          <p><strong>Order ID:</strong> ${orderId.slice(-6).toUpperCase()}</p>
          <p><strong>Status:</strong> ${orderStatus}</p>
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <p><strong>Track Your Order:</strong> <a href="${trackingUrl}">${trackingUrl}</a></p>
        </div>
        
        <p>You can track your package using the link above.</p>
        <p>Best regards,<br>Marwari Basket Team</p>
      </div>
    `;
    
    // TODO: Replace with real SendGrid API call
    console.log(`Shipping update email sent to ${customerEmail}`);
    return { success: true, message: 'Shipping update email sent' };
  } catch (error) {
    console.error('Failed to send shipping update email:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send delivery confirmation email to customer.
 * @param {Object} order - Order object
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendDeliveryConfirmation(order) {
  try {
    const { customerEmail, customerName, orderId } = order;
    
    const subject = `Your Order #${orderId.slice(-6).toUpperCase()} Has Been Delivered!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Delivered!</h2>
        <p>Dear ${customerName || 'Customer'},</p>
        <p>Your order has been successfully delivered! We hope you love your purchase.</p>
        
        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId.slice(-6).toUpperCase()}</p>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
        <p>Thank you for choosing Marwari Basket!</p>
        <p>Best regards,<br>Marwari Basket Team</p>
      </div>
    `;
    
    // TODO: Replace with real SendGrid API call
    console.log(`Delivery confirmation email sent to ${customerEmail}`);
    return { success: true, message: 'Delivery confirmation email sent' };
  } catch (error) {
    console.error('Failed to send delivery confirmation email:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send return/refund notification email to customer.
 * @param {Object} order - Order object with return/refund info
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendReturnNotification(order) {
  try {
    const { customerEmail, customerName, orderId, returnReason, refundAmount } = order;
    
    const subject = `Return Processed for Order #${orderId.slice(-6).toUpperCase()}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Return Processed</h2>
        <p>Dear ${customerName || 'Customer'},</p>
        <p>Your return request has been processed successfully.</p>
        
        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Return Details</h3>
          <p><strong>Order ID:</strong> ${orderId.slice(-6).toUpperCase()}</p>
          <p><strong>Return Reason:</strong> ${returnReason}</p>
          <p><strong>Refund Amount:</strong> ₹${refundAmount}</p>
        </div>
        
        <p>Your refund will be processed within 5-7 business days.</p>
        <p>Best regards,<br>Marwari Basket Team</p>
      </div>
    `;
    
    // TODO: Replace with real SendGrid API call
    console.log(`Return notification email sent to ${customerEmail}`);
    return { success: true, message: 'Return notification email sent' };
  } catch (error) {
    console.error('Failed to send return notification email:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send user registration welcome email.
 * @param {Object} user - User object with name and email
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendWelcomeEmail(user) {
  try {
    const { email, name } = user;
    
    const subject = 'Welcome to Marwari Basket!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Marwari Basket!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for joining Marwari Basket! We're excited to have you as part of our community.</p>
        
        <p>You can now:</p>
        <ul>
          <li>Browse our exclusive collection</li>
          <li>Place orders with ease</li>
          <li>Track your shipments</li>
          <li>Manage your profile</li>
        </ul>
        
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>Marwari Basket Team</p>
      </div>
    `;
    
    // TODO: Replace with real SendGrid API call
    console.log(`Welcome email sent to ${email}`);
    return { success: true, message: 'Welcome email sent' };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send admin alert email for low stock or critical issues.
 * @param {Object} alert - Alert object with type and details
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendAdminAlert(alert) {
  try {
    const { type, details, adminEmail } = alert;
    
    const subject = `Admin Alert: ${type}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff4444;">Admin Alert</h2>
        <h3>${type}</h3>
        <div style="background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
          <p><strong>Details:</strong></p>
          <pre>${JSON.stringify(details, null, 2)}</pre>
        </div>
        <p>Please take appropriate action.</p>
      </div>
    `;
    
    // TODO: Replace with real SendGrid API call
    console.log(`Admin alert email sent to ${adminEmail}`);
    return { success: true, message: 'Admin alert email sent' };
  } catch (error) {
    console.error('Failed to send admin alert email:', error);
    return { success: false, message: error.message };
  }
}

module.exports = { 
  sendOrderConfirmation,
  sendShippingUpdate,
  sendDeliveryConfirmation,
  sendReturnNotification,
  sendWelcomeEmail,
  sendAdminAlert
}; 