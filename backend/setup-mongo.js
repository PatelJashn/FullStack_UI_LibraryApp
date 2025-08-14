import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // load .env

async function testConnection() {
  try {
    console.log('🔗 Testing MongoDB connection...');

    const mongoUri = process.env.MONGO_URI;
    console.log('📡 Connecting to:', mongoUri.replace(/\/\/.*@/, '//***:***@'));

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

testConnection();
