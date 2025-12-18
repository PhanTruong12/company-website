// migrateToCloudinary.js - Script migrate hình ảnh từ local storage lên Cloudinary
const cloudinary = require('../config/cloudinary');
const InteriorImage = require('../models/InteriorImage');
const connectDB = require('../config/database');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const uploadDir = path.join(__dirname, '../../uploads/interior-images');

// Colors for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}📤 ${msg}${colors.reset}`),
};

/**
 * Kiểm tra Cloudinary đã được cấu hình chưa
 */
function checkCloudinaryConfig() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    log.error('CLOUDINARY_CLOUD_NAME không được tìm thấy trong .env');
    log.info('Vui lòng thêm các biến môi trường sau vào file .env:');
    log.info('  CLOUDINARY_CLOUD_NAME=your-cloud-name');
    log.info('  CLOUDINARY_API_KEY=your-api-key');
    log.info('  CLOUDINARY_API_SECRET=your-api-secret');
    return false;
  }
  return true;
}

/**
 * Kiểm tra file có tồn tại không
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Extract public_id từ Cloudinary URL
 */
function extractPublicIdFromUrl(url) {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  const urlParts = url.split('/');
  const uploadIndex = urlParts.findIndex(part => part === 'upload');
  
  if (uploadIndex === -1) return null;
  
  const afterUpload = urlParts.slice(uploadIndex + 1);
  const pathParts = afterUpload.filter(part => !part.startsWith('v'));
  const publicId = pathParts.join('/').replace(/\.[^/.]+$/, '');
  
  return publicId;
}

/**
 * Upload một file lên Cloudinary
 */
async function uploadToCloudinary(filePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'tndgranite/interior-images',
      public_id: publicId,
      overwrite: false,
      resource_type: 'image',
      transformation: [
        {
          width: 1920,
          height: 1080,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto'
        }
      ]
    });
    
    return {
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      url: result.url
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Migrate một hình ảnh
 */
async function migrateImage(image, options = {}) {
  const { dryRun = false, deleteLocal = false } = options;
  
  try {
    // Kiểm tra nếu đã là Cloudinary URL
    if (image.imageUrl && image.imageUrl.includes('cloudinary.com')) {
      log.warn(`Skipping "${image.name}" - Already on Cloudinary`);
      return { skipped: true, reason: 'already_on_cloudinary' };
    }

    // Lấy local file path
    let localPath = image.imageUrl;
    
    // Loại bỏ prefix /uploads/interior-images/ nếu có
    if (localPath.startsWith('/uploads/interior-images/')) {
      localPath = localPath.replace('/uploads/interior-images/', '');
    } else if (localPath.startsWith('uploads/interior-images/')) {
      localPath = localPath.replace('uploads/interior-images/', '');
    }
    
    const fullPath = path.join(uploadDir, localPath);

    // Kiểm tra file có tồn tại không
    if (!fileExists(fullPath)) {
      log.error(`File not found: ${fullPath}`);
      return { error: true, reason: 'file_not_found', path: fullPath };
    }

    // Tạo public_id từ image ID
    const publicId = `interior-${image._id}`;

    if (dryRun) {
      log.step(`[DRY RUN] Would upload: ${image.name}`);
      log.info(`  File: ${fullPath}`);
      log.info(`  Public ID: ${publicId}`);
      return { dryRun: true };
    }

    // Upload lên Cloudinary
    log.step(`Uploading: ${image.name}...`);
    const uploadResult = await uploadToCloudinary(fullPath, publicId);

    if (!uploadResult.success) {
      log.error(`Upload failed: ${image.name} - ${uploadResult.error}`);
      return { error: true, reason: 'upload_failed', error: uploadResult.error };
    }

    // Cập nhật URL trong database
    image.imageUrl = uploadResult.secure_url;
    image.cloudinaryPublicId = uploadResult.public_id;
    await image.save();

    log.success(`Migrated: ${image.name}`);
    log.info(`  URL: ${uploadResult.secure_url}`);

    // Xóa file local nếu được yêu cầu
    if (deleteLocal) {
      try {
        fs.unlinkSync(fullPath);
        log.info(`  Deleted local file: ${localPath}`);
      } catch (deleteError) {
        log.warn(`  Could not delete local file: ${deleteError.message}`);
      }
    }

    return {
      success: true,
      imageId: image._id.toString(),
      oldUrl: image.imageUrl,
      newUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id
    };

  } catch (error) {
    log.error(`Error migrating ${image.name}: ${error.message}`);
    return { error: true, reason: 'exception', error: error.message };
  }
}

/**
 * Main migration function
 */
async function migrateImages(options = {}) {
  const {
    dryRun = false,
    deleteLocal = false,
    limit = null,
    skip = 0
  } = options;

  try {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 CLOUDINARY MIGRATION TOOL');
    console.log('='.repeat(60) + '\n');

    // Kiểm tra Cloudinary config
    if (!checkCloudinaryConfig()) {
      process.exit(1);
    }

    // Kiểm tra thư mục uploads
    if (!fs.existsSync(uploadDir)) {
      log.error(`Upload directory not found: ${uploadDir}`);
      process.exit(1);
    }

    log.info(`Upload directory: ${uploadDir}`);

    if (dryRun) {
      log.warn('⚠️  DRY RUN MODE - No changes will be made\n');
    }

    if (deleteLocal) {
      log.warn('⚠️  DELETE LOCAL MODE - Local files will be deleted after upload\n');
    }

    // Kết nối database
    log.info('Connecting to database...');
    await connectDB();
    log.success('Database connected\n');

    // Lấy tất cả images từ database
    log.info('Fetching images from database...');
    let query = InteriorImage.find({});
    
    if (limit) {
      query = query.limit(parseInt(limit)).skip(parseInt(skip));
      log.info(`Limiting to ${limit} images (skipping ${skip})`);
    }
    
    const images = await query.exec();
    log.success(`Found ${images.length} images to migrate\n`);

    if (images.length === 0) {
      log.warn('No images found to migrate');
      process.exit(0);
    }

    // Thống kê
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    const errors = [];

    // Migrate từng image
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      console.log(`\n[${i + 1}/${images.length}] Processing: ${image.name}`);
      
      const result = await migrateImage(image, { dryRun, deleteLocal });
      
      if (result.skipped) {
        skippedCount++;
      } else if (result.error) {
        errorCount++;
        errors.push({
          image: image.name,
          reason: result.reason,
          error: result.error || result.path
        });
      } else if (result.success || result.dryRun) {
        successCount++;
      }

      // Delay nhỏ để tránh rate limit
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Success: ${successCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📈 Total: ${images.length}`);
    console.log('='.repeat(60) + '\n');

    if (errors.length > 0) {
      console.log('❌ ERRORS DETAILS:');
      errors.forEach((err, index) => {
        console.log(`\n${index + 1}. ${err.image}`);
        console.log(`   Reason: ${err.reason}`);
        if (err.error) {
          console.log(`   Error: ${err.error}`);
        }
      });
      console.log('');
    }

    if (dryRun) {
      log.warn('This was a DRY RUN - No changes were made');
      log.info('Run without --dry-run to perform actual migration');
    }

    process.exit(errorCount > 0 ? 1 : 0);

  } catch (error) {
    log.error(`Migration error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run') || args.includes('-d'),
  deleteLocal: args.includes('--delete-local') || args.includes('-dl'),
  limit: args.find(arg => arg.startsWith('--limit='))?.split('=')[1] || null,
  skip: args.find(arg => arg.startsWith('--skip='))?.split('=')[1] || 0
};

// Run migration
migrateImages(options);

