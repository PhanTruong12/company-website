// core/config/cors.js - CORS configuration
const cors = require('cors');

/**
 * Get allowed origins from environment
 */
const getAllowedOrigins = () => {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
  }
  
  // Development defaults
  return ['http://localhost:5173', 'http://localhost:3000'];
};

/**
 * CORS origin validation function
 */
const corsOrigin = (origin, callback) => {
  const allowedOrigins = getAllowedOrigins();
  
  // Allow requests with no origin (mobile apps, Postman, etc.)
  if (!origin) {
    return callback(null, true);
  }
  
  // Always allow localhost in all environments
  const isLocalhost = origin.startsWith('http://localhost:') || 
                      origin.startsWith('http://127.0.0.1:') ||
                      origin.includes('localhost');
  
  if (isLocalhost) {
    return callback(null, true);
  }
  
  // Allow all origins in development
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    return callback(null, true);
  }
  
  // Production: only allow origins in ALLOWED_ORIGINS
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    console.warn(`⚠️  CORS blocked origin: ${origin}`);
    console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
    callback(new Error('Not allowed by CORS'));
  }
};

/**
 * CORS middleware configuration
 */
const corsOptions = {
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400 // 24 hours
};

module.exports = cors(corsOptions);
