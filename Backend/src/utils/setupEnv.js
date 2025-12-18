// setupEnv.js - Helper script để tạo file .env từ template
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function encodePassword(password) {
  // Encode các ký tự đặc biệt trong password
  return encodeURIComponent(password);
}

async function setup() {
  console.log('\n' + '='.repeat(60));
  console.log('🔧 MongoDB URI Setup Helper');
  console.log('='.repeat(60) + '\n');

  const envPath = path.join(__dirname, '../../.env');
  const examplePath = path.join(__dirname, '../../.env.example');

  // Kiểm tra file .env đã tồn tại chưa
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  File .env đã tồn tại. Bạn có muốn ghi đè? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ Đã hủy.');
      rl.close();
      return;
    }
  }

  console.log('Nhập thông tin MongoDB Atlas:\n');

  const username = await question('Username: ');
  const password = await question('Password: ');
  const cluster = await question('Cluster (ví dụ: cluster0.xxxxx.mongodb.net): ');
  const database = await question('Database name (mặc định: tndgranite): ') || 'tndgranite';

  // Encode password nếu có ký tự đặc biệt
  const encodedPassword = encodePassword(password);
  
  // Tạo MongoDB URI
  const mongoURI = `mongodb+srv://${username}:${encodedPassword}@${cluster}/${database}?retryWrites=true&w=majority`;

  console.log('\n📝 Các thông tin khác (nhấn Enter để dùng giá trị mặc định):\n');

  const port = await question('PORT (mặc định: 5000): ') || '5000';
  const nodeEnv = await question('NODE_ENV (development/production, mặc định: development): ') || 'development';
  
  // Generate JWT Secret
  const crypto = require('crypto');
  const jwtSecret = crypto.randomBytes(32).toString('base64');
  
  const useCloudinary = await question('Bạn có muốn cấu hình Cloudinary? (y/n): ');
  
  let cloudinaryConfig = '';
  if (useCloudinary.toLowerCase() === 'y') {
    const cloudName = await question('Cloudinary Cloud Name: ');
    const apiKey = await question('Cloudinary API Key: ');
    const apiSecret = await question('Cloudinary API Secret: ');
    cloudinaryConfig = `
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=${cloudName}
CLOUDINARY_API_KEY=${apiKey}
CLOUDINARY_API_SECRET=${apiSecret}`;
  }

  // Tạo nội dung file .env
  const envContent = `# MongoDB Configuration
MONGODB_URI=${mongoURI}

# Server Configuration
PORT=${port}
NODE_ENV=${nodeEnv}

# JWT Secret
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d

# CORS Configuration (cho production)
# ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com${cloudinaryConfig}
`;

  // Ghi file .env
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n' + '='.repeat(60));
    console.log('✅ File .env đã được tạo thành công!');
    console.log('='.repeat(60));
    console.log('\n📋 Thông tin đã cấu hình:');
    console.log(`   MongoDB URI: ${mongoURI.replace(encodedPassword, '***')}`);
    console.log(`   PORT: ${port}`);
    console.log(`   NODE_ENV: ${nodeEnv}`);
    console.log(`   JWT_SECRET: ${jwtSecret.substring(0, 20)}...`);
    if (cloudinaryConfig) {
      console.log('   Cloudinary: ✅ Đã cấu hình');
    }
    console.log('\n💡 Tiếp theo:');
    console.log('   1. Kiểm tra kết nối: npm run test:connection');
    console.log('   2. Chạy server: npm run dev');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('❌ Lỗi khi tạo file .env:', error.message);
  }

  rl.close();
}

setup();

