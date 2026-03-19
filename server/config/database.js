const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-sphere', {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('📊 Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Connection string:', process.env.MONGODB_URI || 'mongodb://localhost:27017/service-sphere');
    
    // Retry logic
    setTimeout(() => {
      console.log('🔄 Retrying database connection...');
      connectDB();
    }, 5000);
    
    process.exit(1);
  }
};

module.exports = connectDB;
