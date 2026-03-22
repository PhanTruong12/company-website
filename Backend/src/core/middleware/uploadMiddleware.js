// core/middleware/uploadMiddleware.js - Upload middleware selector
/**
 * Selects appropriate upload middleware based on environment configuration
 * Returns Cloudinary middleware if configured, otherwise local storage middleware
 */
const getUploadMiddleware = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() || '';
  const cloudNameLower = cloudName.toLowerCase();
  const hasCloudinaryConfig = cloudName && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET;
  const cloudNameValid = cloudName === cloudNameLower && /^[a-z0-9_-]+$/.test(cloudName);

  // Fix: prevent uploaded images from being removed after deploy
  // Production must use Cloudinary to avoid local ephemeral disk data loss.
  if (isProduction && (!hasCloudinaryConfig || !cloudNameValid)) {
    throw new Error(
      'Production requires Cloudinary. Set valid CLOUDINARY_CLOUD_NAME (lowercase), CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.'
    );
  }

  if (hasCloudinaryConfig && cloudNameValid) {
    try {
      // Check if packages are installed
      require.resolve('cloudinary');
      require.resolve('multer-storage-cloudinary');

      const upload = require('../../middleware/uploadCloudinary');
      console.log('📦 Using Cloudinary for image storage');
      return upload;
    } catch (error) {
      // Fix: prevent uploaded images from being removed after deploy
      // Production must not silently fall back to ephemeral local disk.
      if (isProduction) {
        throw new Error(
          `Production Cloudinary upload failed to load: ${error.message}. Ensure cloudinary packages are installed.`
        );
      }
      console.warn('⚠️  Cloudinary middleware not available, falling back to Local Storage');
      console.warn('   Reason:', error.message);
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
