// features/images/controllers/adminImage.controller.js - Admin image controller
const imageService = require('../services/image.service');
const { sendSuccess, sendPaginated } = require('../../../shared/utils/response');
const { SUCCESS_MESSAGES, HTTP_STATUS, PAGINATION } = require('../../../shared/constants');
const asyncHandler = require('../../../core/middleware/asyncHandler');
const { emitImagesUpdated } = require('../../../realtime/events');

/**
 * Create new image (Admin only)
 * POST /api/admin/images
 */
const createImage = asyncHandler(async (req, res) => {
  const image = await imageService.createImage(req.body, req.file);
  emitImagesUpdated({ action: 'created', image });
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
  const { stoneType, wallPosition, be_mat, hang_muc, category, page, limit } = req.query;

  const filters = { stoneType, wallPosition, be_mat, hang_muc, category };
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
 * Get all dynamic surfaces (Admin only)
 * GET /api/admin/images/surfaces
 */
const getSurfaces = asyncHandler(async (_req, res) => {
  const surfaces = await imageService.getSurfaces();
  return sendSuccess(
    res,
    surfaces,
    SUCCESS_MESSAGES.RETRIEVED('danh sách bề mặt')
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
  emitImagesUpdated({ action: 'updated', image });
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
  const imageId = req.params.id;
  await imageService.deleteImage(imageId);
  emitImagesUpdated({ action: 'deleted', imageId });
  return sendSuccess(
    res,
    null,
    SUCCESS_MESSAGES.DELETED('hình ảnh')
  );
});

module.exports = {
  createImage,
  getImages,
  getSurfaces,
  getImageById,
  updateImage,
  deleteImage
};
