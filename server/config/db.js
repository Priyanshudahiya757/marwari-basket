const mongoose = require('mongoose');

let isConnected = false;

// Connect to MongoDB Atlas using the URI from environment variables
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/marwari-basket';
    
    if (!mongoURI) {
      console.error('❌ No MongoDB URI found in environment variables');
      console.log('📝 Required environment variables:');
      console.log('   - MONGODB_URI: Your MongoDB connection string');
      console.log('   - JWT_SECRET: Secret key for JWT tokens');
      return false;
    }

    if (isConnected && mongoose.connection.readyState === 1) {
      console.log('✅ Already connected to MongoDB');
      return true;
    }

    console.log('🔌 Connecting to MongoDB...');
    console.log('📊 URI:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    
    // Verify connection is actually established
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection not established after connect');
    }
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Connection state:', mongoose.connection.readyState);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🔍 Connection details:', {
      hasUri: !!process.env.MONGODB_URI,
      hasMongoUri: !!process.env.MONGO_URI,
      nodeEnv: process.env.NODE_ENV,
      readyState: mongoose.connection.readyState
    });
    isConnected = false;
    return false;
  }
};

// Check if database is connected
const isDBConnected = () => {
  const readyState = mongoose.connection.readyState;
  const connected = isConnected && readyState === 1;
  
  if (!connected) {
    console.log('⚠️ Database connection status:', {
      isConnected,
      readyState,
      readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][readyState] || 'unknown'
    });
  }
  
  return connected;
};

// Ensure database connection before operations
const ensureConnection = async () => {
  try {
    if (!isDBConnected()) {
      console.log('🔄 Ensuring database connection...');
      const connected = await connectDB();
      if (!connected) {
        console.error('❌ Failed to establish database connection');
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return false;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    console.log('🧪 Testing database connection...');
    const connected = await ensureConnection();
    if (connected) {
      console.log('✅ Database connection test successful');
      return true;
    } else {
      console.error('❌ Database connection test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Database connection test error:', error.message);
    return false;
  }
};

module.exports = { connectDB, isDBConnected, ensureConnection, testConnection }; 