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
 */
router.post('/', upload.single('image'), createInteriorImage);

/**
 * GET /api/interior-images
 */
router.get('/', getInteriorImages);

/**
 * GET /api/interior-images/:id
 */
router.get('/:id', getInteriorImageById);

/**
 * PUT /api/interior-images/:id
 */
router.put('/:id', upload.single('image'), updateInteriorImage);

/**
 * DELETE /api/interior-images/:id
 */
router.delete('/:id', deleteInteriorImage);

module.exports = router;
