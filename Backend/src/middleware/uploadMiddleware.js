// middleware/uploadMiddleware.js - Upload middleware selector
/**
 * Selects appropriate upload middleware based on environment configuration
 * Returns Cloudinary middleware if configured, otherwise local storage middleware
 */
const getUploadMiddleware = () => {
  const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinaryConfig) {
    try {
      // Check if packages are installed
      require.resolve('cloudinary');
      require.resolve('multer-storage-cloudinary');
      
      // Try to require Cloudinary middleware
      const upload = require('./uploadCloudinary');
      console.log('📦 Using Cloudinary for image storage');
      return upload;
    } catch (error) {
      // Fallback to Local Storage
      console.warn('⚠️  Cloudinary middleware not available, falling back to Local Storage');
      console.warn('   Reason:', error.message);
      console.warn('   Solution: Run "npm install cloudinary multer-storage-cloudinary" to enable Cloudinary');
      return require('./upload');
    }
  } else {
    // No Cloudinary config, use Local Storage
    const upload = require('./upload');
    console.log('📁 Using Local Storage for image storage');
    if (process.env.NODE_ENV === 'development') {
      console.log('   Tip: Add CLOUDINARY_CLOUD_NAME to .env to use Cloudinary');
    }
    return upload;
  }
};

module.exports = getUploadMiddleware();

