const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, isDBConnected } = require('./config/db');
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
const adminRoutes = require('./routes/admin');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize database connection
const initializeServer = async () => {
  try {
    console.log('🚀 Starting Marwari Basket Server...');
    console.log('📊 Environment:', process.env.NODE_ENV || 'development');
    
    // Check required environment variables
    const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars);
      console.error('📝 Please set these in your Vercel environment variables');
      process.exit(1);
    }
    
    // Connect to MongoDB
    const dbConnected = await connectDB();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Server cannot start.');
      process.exit(1);
    }
    
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
        environment: process.env.NODE_ENV || 'development',
        database: isDBConnected() ? 'connected' : 'disconnected'
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
    app.use('/api/admin', adminRoutes); // Admin setup routes

    // Serve uploads folder as static
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    // Upload route
    app.use('/api/upload', uploadRoutes);

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('🔥 Global error handler:', err);
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    });
    
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
    process.exit(1);
  }
};

// Start the server
initializeServer(); 