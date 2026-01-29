// features/images/controllers/adminImage.controller.js - Admin image controller
const imageService = require('../services/image.service');
const { sendSuccess, sendPaginated } = require('../../../shared/utils/response');
const { SUCCESS_MESSAGES, HTTP_STATUS, PAGINATION } = require('../../../shared/constants');
const asyncHandler = require('../../../core/middleware/asyncHandler');

/**
 * Create new image (Admin only)
 * POST /api/admin/images
 */
const createImage = asyncHandler(async (req, res) => {
  const image = await imageService.createImage(req.body, req.file);
  return sendSuccess(
    res,
    image,
    SUCCESS_MESSAGES.CREATED('hình ảnh'),
    HTTP_STATUS.CREATED
  );
});

/**
 * Get images list with pagination (Admin only)
 * GET /api/admin/images
 */
const getImages = asyncHandler(async (req, res) => {
  const { stoneType, wallPosition, page, limit } = req.query;
  
  const filters = { stoneType, wallPosition };
  const pagination = {
    page: parseInt(page) || PAGINATION.DEFAULT_PAGE,
    limit: Math.min(parseInt(limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
  };

  const { images, pagination: paginationData } = await imageService.getImages(filters, pagination);
  
  return sendPaginated(
    res,
    images,
    paginationData,
    SUCCESS_MESSAGES.RETRIEVED('danh sách hình ảnh')
  );
});

/**
 * Get image by ID (Admin only)
 * GET /api/admin/images/:id
 */
const getImageById = asyncHandler(async (req, res) => {
  const image = await imageService.getImageById(req.params.id);
  return sendSuccess(
    res,
    image,
    SUCCESS_MESSAGES.RETRIEVED('hình ảnh')
  );
});

/**
 * Update image (Admin only)
 * PUT /api/admin/images/:id
 */
const updateImage = asyncHandler(async (req, res) => {
  const image = await imageService.updateImage(req.params.id, req.body, req.file);
  return sendSuccess(
    res,
    image,
    SUCCESS_MESSAGES.UPDATED('hình ảnh')
  );
});

/**
 * Delete image (Admin only)
 * DELETE /api/admin/images/:id
 */
const deleteImage = asyncHandler(async (req, res) => {
  await imageService.deleteImage(req.params.id);
  return sendSuccess(
    res,
    null,
    SUCCESS_MESSAGES.DELETED('hình ảnh')
  );
});

module.exports = {
  createImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage
};
