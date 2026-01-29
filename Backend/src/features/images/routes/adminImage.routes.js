// features/images/routes/adminImage.routes.js - Admin image routes
const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../../../core/middleware/auth.middleware');
const upload = require('../../../core/middleware/uploadMiddleware');
const {
  createImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage
} = require('../controllers/adminImage.controller');

/**
 * POST /api/admin/images
 * Create new image (Admin only)
 */
router.post('/', verifyAdminToken, upload.single('image'), createImage);

/**
 * GET /api/admin/images
 * Get images list with pagination (Admin only)
 */
router.get('/', verifyAdminToken, getImages);

/**
 * GET /api/admin/images/:id
 * Get image by ID (Admin only)
 */
router.get('/:id', verifyAdminToken, getImageById);

/**
 * PUT /api/admin/images/:id
 * Update image (Admin only)
 */
router.put('/:id', verifyAdminToken, upload.single('image'), updateImage);

/**
 * DELETE /api/admin/images/:id
 * Delete image (Admin only)
 */
router.delete('/:id', verifyAdminToken, deleteImage);

module.exports = router;
