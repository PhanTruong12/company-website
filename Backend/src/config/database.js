// database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Kiểm tra MONGODB_URI có tồn tại không
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.error('   Please set MONGODB_URI in your .env file');
      process.exit(1);
    }

    // Kiểm tra connection string có placeholder không
    if (mongoURI.includes('<db_password>') || mongoURI.includes('<password>')) {
      console.error('❌ MONGODB_URI contains placeholder. Please replace <db_password> with actual password');
      process.exit(1);
    }

    // Kết nối MongoDB
    const conn = await mongoose.connect(mongoURI, {
      // Options để tránh deprecation warnings
      serverSelectionTimeoutMS: 5000, // Timeout sau 5 giây
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    
    // Xử lý các loại lỗi khác nhau
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('   Authentication failed. Please check:');
      console.error('   1. Username and password in MONGODB_URI are correct');
      console.error('   2. Database user exists in MongoDB Atlas');
      console.error('   3. Password does not contain special characters that need URL encoding');
      console.error('   4. If password has special characters, use encodeURIComponent()');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   Network error. Please check:');
      console.error('   1. Internet connection');
      console.error('   2. MongoDB Atlas cluster is running');
      console.error('   3. IP address is whitelisted in MongoDB Atlas');
    } else if (error.message.includes('timeout')) {
      console.error('   Connection timeout. Please check:');
      console.error('   1. IP address is whitelisted in MongoDB Atlas');
      console.error('   2. Network firewall settings');
    } else {
      console.error(`   ${error.message}`);
    }
    
    console.error('\n   Full error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

