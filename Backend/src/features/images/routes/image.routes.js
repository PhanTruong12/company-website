// features/images/routes/image.routes.js - Public image routes
const express = require('express');
const router = express.Router();
const upload = require('../../../core/middleware/uploadMiddleware');
const {
  createInteriorImage,
  getInteriorImages,
  getInteriorImageById,
  updateInteriorImage,
  deleteInteriorImage
} = require('../controllers/image.controller');

/**
 * POST /api/interior-images
 * Create new image
 */
router.post('/', upload.single('image'), createInteriorImage);

/**
 * GET /api/interior-images
 * Get all images (with optional filters)
 */
router.get('/', getInteriorImages);

/**
 * GET /api/interior-images/:id
 * Get image by ID
 */
router.get('/:id', getInteriorImageById);

/**
 * PUT /api/interior-images/:id
 * Update image
 */
router.put('/:id', upload.single('image'), updateInteriorImage);

/**
 * DELETE /api/interior-images/:id
 * Delete image
 */
router.delete('/:id', deleteInteriorImage);

module.exports = router;
