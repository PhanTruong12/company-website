// upload-reference-images.js - Script để upload ảnh reference lên Cloudinary
// Usage: node scripts/upload-reference-images.js <image-path> [scene-type]
// Example: node scripts/upload-reference-images.js ./reference-images/kitchen.jpg kitchen

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary credentials missing!');
  console.error('Please set in .env:');
  console.error('  CLOUDINARY_CLOUD_NAME');
  console.error('  CLOUDINARY_API_KEY');
  console.error('  CLOUDINARY_API_SECRET');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload ảnh reference lên Cloudinary
 */
async function uploadReferenceImage(imagePath, sceneType = null) {
  try {
    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ File not found: ${imagePath}`);
      return null;
    }

    // Xác định scene type từ filename nếu không được cung cấp
    if (!sceneType) {
      const filename = path.basename(imagePath, path.extname(imagePath));
      if (filename.toLowerCase().includes('kitchen')) {
        sceneType = 'kitchen';
      } else if (filename.toLowerCase().includes('stair')) {
        sceneType = 'stairs';
      } else {
        sceneType = 'unknown';
      }
    }

    // Tạo public_id
    const publicId = `tndgranite/reference-images/${sceneType}-reference`;

    console.log(`\n📤 Uploading: ${path.basename(imagePath)}`);
    console.log(`   Scene Type: ${sceneType}`);
    console.log(`   Public ID: ${publicId}`);

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'tndgranite/reference-images',
      public_id: `${sceneType}-reference`,
      overwrite: true, // Cho phép overwrite nếu đã tồn tại
      resource_type: 'image',
      transformation: [
        {
          quality: 'auto:best', // Chất lượng tốt nhất
          fetch_format: 'auto' // Tự động chọn format (WebP nếu hỗ trợ)
        }
      ]
    });

    console.log(`\n✅ Upload successful!`);
    console.log(`\n📋 Cloudinary URL:`);
    console.log(`   ${result.secure_url}`);
    console.log(`\n📝 Add to frontend/.env:`);
    console.log(`   VITE_${sceneType.toUpperCase()}_REFERENCE_URL=${result.secure_url}`);
    console.log(`\n`);

    return {
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      sceneType: sceneType
    };

  } catch (error) {
    console.error(`\n❌ Upload failed: ${error.message}`);
    if (error.http_code === 401) {
      console.error('   Authentication error - Check your Cloudinary credentials');
    } else if (error.http_code === 400) {
      console.error('   Invalid request - Check file format and size');
    }
    return null;
  }
}

/**
 * Upload nhiều ảnh cùng lúc
 */
async function uploadMultipleImages(imagePaths) {
  const results = [];
  
  for (const imagePath of imagePaths) {
    const result = await uploadReferenceImage(imagePath);
    if (result) {
      results.push(result);
    }
    // Delay giữa các upload để tránh rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('📤 Upload Reference Images to Cloudinary\n');
    console.log('Usage:');
    console.log('  node scripts/upload-reference-images.js <image-path> [scene-type]');
    console.log('  node scripts/upload-reference-images.js <image-path1> <image-path2> ...');
    console.log('\nExamples:');
    console.log('  node scripts/upload-reference-images.js ./reference-images/kitchen.jpg kitchen');
    console.log('  node scripts/upload-reference-images.js ./reference-images/stairs.jpg stairs');
    console.log('  node scripts/upload-reference-images.js ./kitchen.jpg ./stairs.jpg');
    console.log('\nScene types: kitchen, stairs');
    process.exit(0);
  }

  // Upload single hoặc multiple images
  if (args.length === 1) {
    // Chỉ có file path, tự detect scene type
    await uploadReferenceImage(args[0]);
  } else if (args.length === 2 && (args[1] === 'kitchen' || args[1] === 'stairs')) {
    // File path + scene type
    await uploadReferenceImage(args[0], args[1]);
  } else {
    // Multiple files
    await uploadMultipleImages(args);
  }
}

// Run script
main().catch(error => {
  console.error('❌ Script error:', error);
  process.exit(1);
});

