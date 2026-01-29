// shared/utils/fileHelper.js - File operation helpers
const fs = require('fs');
const path = require('path');

// Try to load cloudinary config if available
let cloudinary = null;
try {
  cloudinary = require('../../config/cloudinary');
} catch (error) {
  // Cloudinary config not available, will use local storage
}

/**
 * Check if URL is Cloudinary URL
 */
const isCloudinaryUrl = (url) => {
  return url && (url.includes('cloudinary.com') || url.includes('res.cloudinary.com'));
};

/**
 * Extract public_id from Cloudinary URL
 */
const extractCloudinaryPublicId = (imageUrl) => {
  try {
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return null;
    
    const afterUpload = urlParts.slice(uploadIndex + 1);
    const pathParts = afterUpload.filter(part => !part.startsWith('v'));
    const publicId = pathParts.join('/').replace(/\.[^/.]+$/, '');
    
    return publicId || null;
  } catch (error) {
    console.error('Error extracting Cloudinary public_id:', error.message);
    return null;
  }
};

/**
 * Delete file from Cloudinary
 */
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!isCloudinaryUrl(imageUrl)) {
      return false;
    }
    
    if (!cloudinary) {
      console.warn('Cloudinary not configured, cannot delete from Cloudinary');
      return false;
    }
    
    const publicId = extractCloudinaryPublicId(imageUrl);
    if (!publicId) {
      return false;
    }
    
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error.message);
    return false;
  }
};

/**
 * Delete local file
 */
const deleteLocalFile = (imageUrl) => {
  try {
    if (!imageUrl) return false;
    
    // Remove leading slash if present
    const filePath = imageUrl.startsWith('/') 
      ? path.join(__dirname, '../../../', imageUrl.substring(1))
      : path.join(__dirname, '../../../', imageUrl);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting local file:', error.message);
    return false;
  }
};

/**
 * Delete file (handles both Cloudinary and local)
 */
const deleteFile = async (imageUrl) => {
  if (isCloudinaryUrl(imageUrl)) {
    return await deleteFromCloudinary(imageUrl);
  } else {
    return deleteLocalFile(imageUrl);
  }
};

/**
 * Get image URL from multer file object
 */
const getImageUrl = (file) => {
  if (!file) return null;
  
  // Cloudinary upload
  if (file.secure_url || file.url) {
    return file.secure_url || file.url;
  }
  
  // Local storage upload
  return `/uploads/interior-images/${file.filename}`;
};

/**
 * Get Cloudinary public_id from multer file object
 */
const getCloudinaryPublicId = (file) => {
  if (!file) return null;
  return file.public_id || null;
};

module.exports = {
  isCloudinaryUrl,
  extractCloudinaryPublicId,
  deleteFromCloudinary,
  deleteLocalFile,
  deleteFile,
  getImageUrl,
  getCloudinaryPublicId
};
