// features/images/controllers/image.controller.js - Image controller
const imageService = require('../services/image.service');
const { sendSuccess, sendPaginated } = require('../../../shared/utils/response');
const { SUCCESS_MESSAGES, HTTP_STATUS, PAGINATION } = require('../../../shared/constants');
const asyncHandler = require('../../../core/middleware/asyncHandler');

/**
 * Create new image (Public)
 * POST /api/interior-images
 */
const createInteriorImage = asyncHandler(async (req, res) => {
  const image = await imageService.createImage(req.body, req.file);
  return sendSuccess(
    res,
    image,
    SUCCESS_MESSAGES.CREATED('hình ảnh'),
    HTTP_STATUS.CREATED
  );
});

/**
 * Get all images (Public - no pagination)
 * GET /api/interior-images
 */
const getInteriorImages = asyncHandler(async (req, res) => {
  const images = await imageService.getAllImages(req.query);
  return sendSuccess(
    res,
    images,
    SUCCESS_MESSAGES.RETRIEVED('danh sách hình ảnh')
  );
});

/**
 * Get image by ID (Public)
 * GET /api/interior-images/:id
 */
const getInteriorImageById = asyncHandler(async (req, res) => {
  const image = await imageService.getImageById(req.params.id);
  return sendSuccess(
    res,
    image,
    SUCCESS_MESSAGES.RETRIEVED('hình ảnh')
  );
});

/**
 * Update image (Public)
 * PUT /api/interior-images/:id
 */
const updateInteriorImage = asyncHandler(async (req, res) => {
  const image = await imageService.updateImage(req.params.id, req.body, req.file);
  return sendSuccess(
    res,
    image,
    SUCCESS_MESSAGES.UPDATED('hình ảnh')
  );
});

/**
 * Delete image (Public)
 * DELETE /api/interior-images/:id
 */
const deleteInteriorImage = asyncHandler(async (req, res) => {
  await imageService.deleteImage(req.params.id);
  return sendSuccess(
    res,
    null,
    SUCCESS_MESSAGES.DELETED('hình ảnh')
  );
});

module.exports = {
  createInteriorImage,
  getInteriorImages,
  getInteriorImageById,
  updateInteriorImage,
  deleteInteriorImage
};
