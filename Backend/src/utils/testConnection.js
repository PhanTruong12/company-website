// testConnection.js - Script để test kết nối MongoDB và Cloudinary
require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');

async function testMongoDB() {
  console.log('\n🔍 Testing MongoDB Connection...');
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.error('❌ MONGODB_URI is not set in .env');
    return false;
  }

  if (mongoURI.includes('<db_password>') || mongoURI.includes('<password>')) {
    console.error('❌ MONGODB_URI contains placeholder. Please replace with actual password');
    return false;
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connection successful');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('   Authentication error. Check:');
      console.error('   - Username and password in connection string');
      console.error('   - Special characters in password need URL encoding');
      console.error('   - Database user exists in MongoDB Atlas');
    } else if (error.message.includes('Could not connect to any servers') || 
               error.message.includes('IP whitelist') ||
               error.name === 'MongooseServerSelectionError' ||
               (error.reason && error.reason.type === 'ReplicaSetNoPrimary')) {
      console.error('   ⚠️  IP WHITELIST ERROR!');
      console.error('   Your IP address is not whitelisted in MongoDB Atlas.');
      console.error('\n   Quick fix:');
      console.error('   1. Go to MongoDB Atlas → Network Access');
      console.error('   2. Add IP Address: 0.0.0.0/0 (allows all IPs)');
      console.error('   3. Wait 1-2 minutes, then try again');
      console.error('\n   See Backend/RAILWAY_MONGODB_FIX.md for detailed instructions');
    } else {
      console.error(`   ${error.message}`);
    }
    return false;
  }
}

async function testCloudinary() {
  console.log('\n🔍 Testing Cloudinary Connection...');
  
  const hasConfig = process.env.CLOUDINARY_CLOUD_NAME && 
                   process.env.CLOUDINARY_API_KEY && 
                   process.env.CLOUDINARY_API_SECRET;

  if (!hasConfig) {
    console.log('⚠️  Cloudinary not configured (skipping test)');
    return true;
  }

  try {
    // Test bằng cách gọi API
    const result = await cloudinary.api.ping();
    if (result && result.status === 'ok') {
      console.log('✅ Cloudinary connection successful');
      console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
      return true;
    } else {
      throw new Error('Cloudinary ping returned unexpected result');
    }
  } catch (error) {
    console.error('❌ Cloudinary connection failed:');
    
    // Xử lý error từ Cloudinary SDK
    if (error && typeof error === 'object') {
      if (error.message) {
        console.error(`   ${error.message}`);
      } else if (error.error) {
        console.error(`   ${error.error.message || JSON.stringify(error.error)}`);
      } else {
        console.error(`   ${JSON.stringify(error, null, 2)}`);
      }
      
      if (error.http_code) {
        console.error(`   HTTP Code: ${error.http_code}`);
      }
      
      if (error.message && (error.message.includes('authentication') || error.message.includes('Invalid') || error.message.includes('mismatch') || error.http_code === 401)) {
        console.error('\n   Configuration error. Check:');
        console.error('   - CLOUDINARY_CLOUD_NAME is correct');
        console.error('   - CLOUDINARY_API_KEY matches the cloud_name');
        console.error('   - CLOUDINARY_API_SECRET matches the cloud_name');
        if (error.message.includes('mismatch')) {
          console.error('   ⚠️  Cloud name mismatch: API Key/Secret không khớp với Cloud Name');
        }
      }
    } else {
      console.error(`   ${String(error)}`);
    }
    
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('🔧 Connection Test Tool');
  console.log('='.repeat(60));

  const mongoOK = await testMongoDB();
  const cloudinaryOK = await testCloudinary();

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results:');
  console.log(`   MongoDB: ${mongoOK ? '✅ OK' : '❌ FAILED'}`);
  console.log(`   Cloudinary: ${cloudinaryOK ? '✅ OK' : '⚠️  Not configured or failed'}`);
  console.log('='.repeat(60) + '\n');

  process.exit(mongoOK ? 0 : 1);
}

runTests();

