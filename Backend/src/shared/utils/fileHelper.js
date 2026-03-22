// shared/utils/fileHelper.js - File operation helpers
const fs = require('fs');
const path = require('path');
const uploadRoot = process.env.UPLOAD_ROOT
  ? path.resolve(process.env.UPLOAD_ROOT)
  : path.resolve(process.cwd(), 'uploads');

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
 * Extract public_id from Cloudinary URL (kể cả URL có transformation)
 * Format: .../upload/<transforms>/v<version>/<public_id>.<ext>
 */
const extractCloudinaryPublicId = (imageUrl) => {
  try {
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;

    const afterUpload = urlParts.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex(part => /^v\d+$/.test(part));
    if (versionIndex === -1) {
      const pathParts = afterUpload.filter(part => !part.startsWith('v'));
      const joined = pathParts.join('/').replace(/\.[^/.]+$/, '');
      return joined || null;
    }
    const afterVersion = afterUpload.slice(versionIndex + 1).join('/').replace(/\.[^/.]+$/, '');
    return afterVersion || null;
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
    const normalized = imageUrl.replace(/^\/+/, '');
    const relativeToUploads = normalized.startsWith('uploads/')
      ? normalized.substring('uploads/'.length)
      : normalized;
    const filePath = path.join(uploadRoot, relativeToUploads);
    
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
 * multer-storage-cloudinary v4 sets: path = secure_url, filename = public_id (not secure_url/public_id on file).
 * @see node_modules/multer-storage-cloudinary/lib/index.js _handleFile callback
 */
const isHttpUrl = (s) => typeof s === 'string' && /^https?:\/\//i.test(s.trim());

/**
 * Get image URL from multer file object
 */
const getImageUrl = (file) => {
  if (!file) return null;

  // Cloudinary (legacy / direct SDK)
  if (file.secure_url || file.url) {
    return file.secure_url || file.url;
  }
  // multer-storage-cloudinary v4: URL is in `path`
  if (isHttpUrl(file.path)) {
    return file.path.trim();
  }

  // Local storage upload
  return `/uploads/interior-images/${file.filename}`;
};

/**
 * Get Cloudinary public_id from multer file object
 */
const getCloudinaryPublicId = (file) => {
  if (!file) return null;
  if (file.public_id) return file.public_id;
  // v4: public_id is stored in `filename` when `path` is the Cloudinary URL
  if (isHttpUrl(file.path) && file.filename) {
    return file.filename;
  }
  return null;
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
