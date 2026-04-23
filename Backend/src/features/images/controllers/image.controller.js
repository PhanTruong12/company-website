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
 * Get images (Public — paginated; default page=1, limit=12)
 * GET /api/interior-images?page=&limit=&stoneType=&wallPosition=
 */
const getInteriorImages = asyncHandler(async (req, res) => {
  const { stoneType, wallPosition, be_mat, hang_muc, category, page, limit } = req.query;
  const filters = { stoneType, wallPosition, be_mat, hang_muc, category };
  const pagination = {
    page: parseInt(page, 10) || PAGINATION.DEFAULT_PAGE,
    limit: Math.min(
      parseInt(limit, 10) || 12,
      PAGINATION.MAX_LIMIT
    )
  };

  const { images, pagination: paginationData } = await imageService.getImages(
    filters,
    pagination
  );

  return sendPaginated(
    res,
    images,
    paginationData,
    SUCCESS_MESSAGES.RETRIEVED('danh sách hình ảnh')
  );
});

/**
 * Get all dynamic surfaces (Public)
 * GET /api/interior-images/surfaces
 */
const getInteriorImageSurfaces = asyncHandler(async (_req, res) => {
  const surfaces = await imageService.getSurfaces();
  return sendSuccess(
    res,
    surfaces,
    SUCCESS_MESSAGES.RETRIEVED('danh sách bề mặt')
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
  getInteriorImageSurfaces,
  getInteriorImageById,
  updateInteriorImage,
  deleteInteriorImage
};
