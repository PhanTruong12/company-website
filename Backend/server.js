// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables based on NODE_ENV
// Nếu NODE_ENV không được set, mặc định là development
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

// Thử load file .env cụ thể, nếu không có thì load .env mặc định
require('dotenv').config({ path: path.resolve(__dirname, envFile) });
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Fallback to .env

const connectDB = require('./src/config/database');

const app = express();
const port = process.env.PORT || 5000;

// CORS phải được setup TRƯỚC khi kết nối database
// để tránh lỗi khi browser gửi preflight OPTIONS request

// Middleware
// CORS Configuration - Cho phép frontend production URL
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000']; // Development defaults

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Luôn cho phép localhost trong mọi trường hợp (development và production)
    const isLocalhost = origin.startsWith('http://localhost:') || 
                        origin.startsWith('http://127.0.0.1:') ||
                        origin.includes('localhost');
    
    if (isLocalhost) {
      return callback(null, true);
    }
    
    // Cho phép tất cả origins trong development
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      return callback(null, true);
    }
    
    // Production: chỉ cho phép origins trong ALLOWED_ORIGINS
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files từ thư mục uploads
app.use('/uploads', express.static('uploads'));

// Health check endpoint (không cần database)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.get('/', (req, res) => {
  res.send('Chào mừng đến với API giới thiệu công ty!');
});

// API Routes
app.use('/api/interior-images', require('./src/routes/interiorImageRoutes'));
app.use('/api/stone-types', require('./src/routes/stoneTypeRoutes'));
app.use('/api/wall-positions', require('./src/routes/wallPositionRoutes'));
app.use('/api/search', require('./src/routes/searchRoutes'));
// Admin Routes (Internal only)
app.use('/api/admin', require('./src/routes/admin.routes'));
// app.use('/api/interior-types', require('./src/routes/interiorTypeRoutes'));
// app.use('/api/products', require('./src/routes/productRoutes'));

// Kết nối Database sau khi setup routes
// Điều này đảm bảo server có thể phản hồi ngay cả khi database chưa kết nối
connectDB().catch((error) => {
  console.error('Failed to connect to database:', error);
  // Không exit process để server vẫn có thể chạy và hiển thị error message
});

app.listen(port, () => {
  console.log(`Server đang chạy trên cổng: ${port}`);
});