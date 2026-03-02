// core/middleware/uploadMiddleware.js - Upload middleware selector
/**
 * Selects appropriate upload middleware based on environment configuration
 * Returns Cloudinary middleware if configured, otherwise local storage middleware
 */
const getUploadMiddleware = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() || '';
  const cloudNameLower = cloudName.toLowerCase();
  const hasCloudinaryConfig = cloudName && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET;
  const cloudNameValid = cloudName === cloudNameLower && /^[a-z0-9_-]+$/.test(cloudName);

  if (hasCloudinaryConfig && cloudNameValid) {
    try {
      // Check if packages are installed
      require.resolve('cloudinary');
      require.resolve('multer-storage-cloudinary');
      
      // Try to require Cloudinary middleware
      const upload = require('../../middleware/uploadCloudinary');
      console.log('📦 Using Cloudinary for image storage');
      return upload;
    } catch (error) {
      // Fallback to Local Storage
      console.warn('⚠️  Cloudinary middleware not available, falling back to Local Storage');
      console.warn('   Reason:', error.message);
      console.warn('   Solution: Run "npm install cloudinary multer-storage-cloudinary" to enable Cloudinary');
      return require('../../middleware/upload');
    }
  } else {
    // No Cloudinary config or invalid name, use Local Storage
    const upload = require('../../middleware/upload');
    console.log('📁 Using Local Storage for image storage');
    if (process.env.NODE_ENV === 'development') {
      if (!hasCloudinaryConfig) {
        console.log('   Tip: Add CLOUDINARY_CLOUD_NAME to .env to use Cloudinary');
      } else if (!cloudNameValid) {
        console.log('   Tip: CLOUDINARY_CLOUD_NAME must be lowercase (a-z, 0-9, _ or -)');
      }
    }
    return upload;
  }
};

module.exports = getUploadMiddleware();
