// server.js - Main application entry point
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { loadEnv } = require('./src/config/env');
const corsMiddleware = require('./src/config/cors');
const { initializeSocket } = require('./src/realtime/socket');
const connectDB = require('./src/config/database');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

// Load environment variables
loadEnv();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// ==================== Middleware ====================
// CORS must be setup BEFORE database connection
// to avoid errors when browser sends preflight OPTIONS request
app.use(corsMiddleware);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
// Fix: prevent uploaded images from being removed after deploy
// Serve uploads from configurable absolute path (supports mounted persistent volumes).
const uploadRoot = process.env.UPLOAD_ROOT
  ? path.resolve(process.env.UPLOAD_ROOT)
  : path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}
app.use('/uploads', express.static(uploadRoot));

// ==================== Routes ====================
// Health check endpoint (doesn't require database)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Chào mừng đến với API giới thiệu công ty TND Granite!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// API Routes
app.use('/api/interior-images', require('./src/features/images/routes/image.routes'));
app.use('/api/stone-types', require('./src/routes/stoneTypeRoutes'));
app.use('/api/wall-positions', require('./src/routes/wallPositionRoutes'));
app.use('/api/search', require('./src/routes/searchRoutes'));
app.use('/api/admin', require('./src/features/admin/routes'));

// ==================== Error Handling ====================
// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Initialize realtime socket server after middleware/routes are configured
initializeSocket(server);

// ==================== Database Connection ====================
// Connect to database after setting up routes
// This ensures server can respond even if database is not connected
connectDB().catch((error) => {
  console.error('Failed to connect to database:', error);
  // Don't exit process so server can still run and display error message
});

// ==================== Start Server ====================
server.listen(port, () => {
  console.log(`🚀 Server đang chạy trên cổng: ${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${port}/health`);
});