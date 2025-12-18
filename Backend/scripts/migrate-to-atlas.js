// migrate-to-atlas.js - Script để migrate database lên MongoDB Atlas
const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
};

// Configuration
const LOCAL_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017/tndgranite';
const ATLAS_URI = process.env.MONGODB_URI;

if (!ATLAS_URI) {
  log.error('MONGODB_URI không được tìm thấy trong .env');
  log.info('Vui lòng thêm MONGODB_URI vào file .env');
  process.exit(1);
}

const BACKUP_DIR = path.join(__dirname, '../../backup');
const DB_NAME = 'tndgranite';

async function migrate() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 MIGRATE DATABASE TO MONGODB ATLAS');
  console.log('='.repeat(60) + '\n');

  try {
    // Step 1: Export from local
    log.info('📤 Step 1: Exporting from local MongoDB...');
    log.info(`   Source: ${LOCAL_URI}`);
    
    try {
      execSync(`mongodump --uri="${LOCAL_URI}" --out="${BACKUP_DIR}"`, {
        stdio: 'inherit'
      });
      log.success('Export completed successfully!');
    } catch (error) {
      log.error('Export failed!');
      log.warn('Make sure:');
      log.warn('  1. Local MongoDB is running');
      log.warn('  2. mongodump is installed');
      log.warn('  3. Database name is correct');
      process.exit(1);
    }

    console.log('');

    // Step 2: Import to Atlas
    log.info('📥 Step 2: Importing to MongoDB Atlas...');
    log.info(`   Target: ${ATLAS_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    try {
      execSync(`mongorestore --uri="${ATLAS_URI}" --drop "${BACKUP_DIR}/${DB_NAME}"`, {
        stdio: 'inherit'
      });
      log.success('Import completed successfully!');
    } catch (error) {
      log.error('Import failed!');
      log.warn('Make sure:');
      log.warn('  1. MongoDB Atlas connection string is correct');
      log.warn('  2. IP address is whitelisted');
      log.warn('  3. Database user has proper permissions');
      process.exit(1);
    }

    console.log('');

    // Step 3: Summary
    log.success('🎉 Migration completed successfully!');
    console.log('\n' + '='.repeat(60));
    log.info('Next steps:');
    log.info('  1. Verify data on MongoDB Atlas dashboard');
    log.info('  2. Update .env with Atlas connection string');
    log.info('  3. Test API endpoints');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    log.error(`Migration error: ${error.message}`);
    process.exit(1);
  }
}

// Run migration
migrate();

