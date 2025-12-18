// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/database');

const app = express();
const port = process.env.PORT || 5000;

// Kết nối Database
connectDB();

// Middleware
// CORS Configuration - Cho phép frontend production URL
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000']; // Development defaults

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Serve static files từ thư mục uploads
app.use('/uploads', express.static('uploads'));

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

app.listen(port, () => {
  console.log(`Server đang chạy trên cổng: ${port}`);
});