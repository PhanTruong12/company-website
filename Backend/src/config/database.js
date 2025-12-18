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

    // Kết nối MongoDB với retry logic
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const conn = await mongoose.connect(mongoURI, {
          // Options để tránh deprecation warnings
          serverSelectionTimeoutMS: 10000, // Tăng timeout lên 10 giây
          socketTimeoutMS: 45000,
          maxPoolSize: 10,
          retryWrites: true,
          w: 'majority'
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        return; // Thành công, thoát khỏi function
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          console.log(`⚠️  Connection attempt ${attempt} failed, retrying... (${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
        }
      }
    }
    
    // Nếu tất cả retries đều fail, throw error để xử lý ở catch block
    throw lastError;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    
    // Xử lý các loại lỗi khác nhau
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('   Authentication failed. Please check:');
      console.error('   1. Username and password in MONGODB_URI are correct');
      console.error('   2. Database user exists in MongoDB Atlas');
      console.error('   3. Password does not contain special characters that need URL encoding');
      console.error('   4. If password has special characters, use encodeURIComponent()');
    } else if (error.message.includes('Could not connect to any servers') || 
               error.message.includes('IP whitelist') ||
               error.name === 'MongooseServerSelectionError' ||
               (error.reason && error.reason.type === 'ReplicaSetNoPrimary') ||
               (error.cause && error.cause.type === 'ReplicaSetNoPrimary')) {
      console.error('\n' + '='.repeat(70));
      console.error('   ⚠️  IP WHITELIST ERROR - This is the most common issue!');
      console.error('='.repeat(70));
      console.error('   Your server IP address is NOT whitelisted in MongoDB Atlas.');
      console.error('   This is REQUIRED for Railway/Render/Vercel deployments.');
      console.error('\n   🔧 STEP-BY-STEP FIX:');
      console.error('   1. Open MongoDB Atlas: https://cloud.mongodb.com/');
      console.error('   2. Select your project → Click on your cluster');
      console.error('   3. Click "Network Access" tab (left sidebar)');
      console.error('   4. Click green "Add IP Address" button');
      console.error('   5. Select "Allow Access from Anywhere"');
      console.error('      OR manually enter: 0.0.0.0/0');
      console.error('   6. Click "Confirm"');
      console.error('   7. Wait 2-3 minutes for MongoDB to update');
      console.error('   8. Go to Railway → Redeploy your service');
      console.error('\n   ⚠️  IMPORTANT: You MUST do this BEFORE the app can connect!');
      console.error('   📝 0.0.0.0/0 = Allow all IPs (works for cloud platforms)');
      console.error('='.repeat(70) + '\n');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   Network error. Please check:');
      console.error('   1. Internet connection');
      console.error('   2. MongoDB Atlas cluster is running');
      console.error('   3. IP address is whitelisted in MongoDB Atlas');
    } else if (error.message.includes('timeout')) {
      console.error('   Connection timeout. Please check:');
      console.error('   1. IP address is whitelisted in MongoDB Atlas');
      console.error('   2. Network firewall settings');
      console.error('   3. MongoDB Atlas cluster is running');
    } else {
      console.error(`   ${error.message}`);
    }
    
    console.error('\n   Full error:', error);
    // Không exit process trong production để server vẫn có thể chạy
    // Chỉ exit trong development để developer biết có lỗi
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
    // Trong production, chỉ log error và tiếp tục
    // Routes sẽ xử lý lỗi khi database chưa kết nối
  }
};

module.exports = connectDB;

