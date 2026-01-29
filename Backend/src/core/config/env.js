// core/config/env.js - Environment configuration loader
const path = require('path');
require('dotenv').config();

/**
 * Load environment variables based on NODE_ENV
 * Falls back to .env if specific env file doesn't exist
 */
const loadEnv = () => {
  const env = process.env.NODE_ENV || 'development';
  const envFile = env === 'production' ? '.env.production' : '.env.development';
  
  // Try to load specific env file first
  require('dotenv').config({ path: path.resolve(__dirname, '../../../', envFile) });
  
  // Fallback to .env
  require('dotenv').config({ path: path.resolve(__dirname, '../../../', '.env') });
};

// Load env on require
loadEnv();

module.exports = {
  loadEnv,
  isDevelopment: () => process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
  isProduction: () => process.env.NODE_ENV === 'production',
  getEnv: (key, defaultValue = null) => process.env[key] || defaultValue
};
