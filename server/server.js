const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const categoryRoutes = require('./routes/category');
const uploadRoutes = require('./routes/upload');
const dashboardRoutes = require('./routes/dashboard');
const adminProductRoutes = require('./routes/adminProduct');
const adminOrderRoutes = require('./routes/adminOrder');
const adminCustomerRoutes = require('./routes/adminCustomer');
const adminInventoryRoutes = require('./routes/adminInventory');
const adminAnalyticsRoutes = require('./routes/adminAnalytics');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Secure HTTP headers
app.use(express.json()); // Parse JSON request bodies

// Basic root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Marwari Basket API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // User & admin routes
app.use('/api/categories', categoryRoutes); // Category routes
app.use('/api/products', productRoutes); // Product routes
app.use('/api/orders', orderRoutes); // Order routes
app.use('/api/admin/dashboard', dashboardRoutes); // Dashboard routes
app.use('/api/admin/products', adminProductRoutes); // Admin product routes
app.use('/api/admin/orders', adminOrderRoutes); // Admin order routes
app.use('/api/admin/customers', adminCustomerRoutes); // Admin customer routes
app.use('/api/admin/inventory', adminInventoryRoutes); // Admin inventory routes
app.use('/api/admin/analytics', adminAnalyticsRoutes); // Admin analytics routes

// Serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Upload route
app.use('/api/upload', uploadRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 