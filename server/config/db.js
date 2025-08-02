const mongoose = require('mongoose');

// Connect to MongoDB Atlas using the URI from environment variables
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/marwari-basket';
    
    if (!mongoURI) {
      console.log('⚠️  No MongoDB URI found. Using mock mode for testing.');
      console.log('📝 To use real database:');
      console.log('   1. Install MongoDB locally, OR');
      console.log('   2. Create free MongoDB Atlas account at mongodb.com/atlas');
      console.log('   3. Update MONGO_URI in server/.env file');
      return;
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('📝 Server will run in mock mode. Some features may not work.');
    console.log('💡 To fix: Install MongoDB or use MongoDB Atlas');
  }
};

module.exports = connectDB; 