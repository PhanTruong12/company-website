#!/usr/bin/env node
/**
 * Script to create .env files from examples
 * Usage: node scripts/create-env-files.js [development|production|both]
 */

const fs = require('fs');
const path = require('path');

const envTemplates = {
  development: `# ============================================
# Development Environment Configuration
# ============================================
# Auto-generated from template
# Edit this file with your actual values
# ============================================

# MongoDB Configuration
# Can use MongoDB Atlas (recommended) or local MongoDB
# For local: mongodb://localhost:27017/tndgranite
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tndgranite-dev

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication
# Development: Can use a simple secret (but still keep it secure!)
# Generate one with: npm run generate:jwt-secret
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
# Not needed in development - localhost is automatically allowed
# ALLOWED_ORIGINS is ignored in development mode

# Cloudinary Configuration (Optional)
# Optional: Can use Cloudinary or local storage for development
# If not set, images stored locally in /uploads directory
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
`,

  production: `# ============================================
# Production Environment Configuration
# ============================================
# Auto-generated from template
# Edit this file with your actual values
# 
# ⚠️  SECURITY WARNING:
# - Use STRONG secrets in production
# - Never commit this file with real values
# - Use environment variables on your hosting platform
# ============================================

# MongoDB Configuration (REQUIRED)
# Use MongoDB Atlas production cluster
# Ensure IP whitelist includes your hosting platform IPs (or 0.0.0.0/0)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tndgranite

# Server Configuration
# Port (usually set by hosting platform, but can override)
PORT=5000
NODE_ENV=production

# JWT Authentication (REQUIRED - STRONG SECRET!)
# ⚠️  CRITICAL: Use a STRONG, RANDOM secret in production!
# Generate one with: npm run generate:jwt-secret
# Minimum 32 characters, use random bytes
JWT_SECRET=CHANGE-THIS-TO-A-STRONG-RANDOM-SECRET-MINIMUM-32-CHARACTERS

# JWT token expiration time
JWT_EXPIRES_IN=7d

# CORS Configuration (REQUIRED)
# Comma-separated list of allowed frontend origins
# Only these origins can access the API
# Example: https://tndgranite-ashy.vercel.app,https://www.yourdomain.com
ALLOWED_ORIGINS=https://your-frontend-production-url.com

# Cloudinary Configuration (REQUIRED for Production)
# Production should use Cloudinary for image storage
# Get credentials from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
`
};

function createEnvFile(env, overwrite = false) {
  const fileName = `.env.${env}`;
  const filePath = path.join(__dirname, '..', fileName);
  
  if (fs.existsSync(filePath) && !overwrite) {
    console.log(`⚠️  ${fileName} already exists. Use --overwrite to replace.`);
    return false;
  }
  
  try {
    fs.writeFileSync(filePath, envTemplates[env]);
    console.log(`✅ Created ${fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${fileName}:`, error.message);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'both';
  const overwrite = args.includes('--overwrite') || args.includes('-f');
  
  console.log('\n' + '='.repeat(60));
  console.log('🔧 Environment Files Creator');
  console.log('='.repeat(60) + '\n');
  
  if (mode === 'development' || mode === 'both') {
    createEnvFile('development', overwrite);
  }
  
  if (mode === 'production' || mode === 'both') {
    createEnvFile('production', overwrite);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📝 Next Steps:');
  console.log('   1. Edit the .env files with your actual values');
  console.log('   2. Generate JWT secret: npm run generate:jwt-secret');
  console.log('   3. Test connection: npm run test:connection');
  console.log('   4. Start server: npm run dev (development)');
  console.log('='.repeat(60) + '\n');
}

main();

