// adminImage.controller.js - Admin Image CRUD Controller
// All routes are protected by verifyAdminToken middleware
// Supports both Cloudinary and Local Storage
const InteriorImage = require('../models/InteriorImage');
const { BadRequestError, NotFoundError } = require('../utils/errors/AppError');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_STATUS, PAGINATION } = require('../constants');
const { getImageUrl, getCloudinaryPublicId, deleteFile } = require('../utils/fileHelper');

/**
 * Create new image (Admin only)
 * POST /api/admin/images
 */
const createImage = async (req, res) => {
  const { name, stoneType, wallPosition, description } = req.body;

  // Validation
  if (!name || !stoneType || !wallPosition) {
    throw new BadRequestError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
  }

  if (!req.file) {
    throw new BadRequestError(ERROR_MESSAGES.FILE_REQUIRED);
  }

  // Get image URL and Cloudinary public_id
  const imageUrl = getImageUrl(req.file);
  const cloudinaryPublicId = getCloudinaryPublicId(req.file);

  try {
    // Create new document
    const interiorImage = new InteriorImage({
      name,
      stoneType,
      wallPosition,
      description: description || '',
      imageUrl,
      ...(cloudinaryPublicId && { cloudinaryPublicId })
    });

    await interiorImage.save();

    return sendSuccess(
      res,
      interiorImage,
      SUCCESS_MESSAGES.CREATED('hình ảnh'),
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    // Delete uploaded file if there's an error
    if (req.file && imageUrl) {
      await deleteFile(imageUrl);
    }
    throw error;
  }
};

/**
 * Get images list (Admin only)
 * GET /api/admin/images
 * Query params: stoneType, wallPosition, page, limit
 */
const getImages = async (req, res) => {
  const { stoneType, wallPosition, page, limit } = req.query;
  const filter = {};

  // Add filters if provided
  if (stoneType) filter.stoneType = stoneType;
  if (wallPosition) filter.wallPosition = wallPosition;

  // Pagination
  const pageNum = parseInt(page) || PAGINATION.DEFAULT_PAGE;
  const limitNum = Math.min(
    parseInt(limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const skip = (pageNum - 1) * limitNum;

  // Get total count
  const total = await InteriorImage.countDocuments(filter);

  // Get paginated list
  const images = await InteriorImage.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return sendPaginated(res, images, {
    page: pageNum,
    limit: limitNum,
    total
  }, SUCCESS_MESSAGES.RETRIEVED('danh sách hình ảnh'));
};

/**
 * Get image by ID (Admin only)
 * GET /api/admin/images/:id
 */
const getImageById = async (req, res) => {
  const { id } = req.params;

  const image = await InteriorImage.findById(id);

  if (!image) {
    throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND('Hình ảnh'));
  }

  return sendSuccess(res, image, SUCCESS_MESSAGES.RETRIEVED('hình ảnh'));
};

/**
 * Update image (Admin only)
 * PUT /api/admin/images/:id
 */
const updateImage = async (req, res) => {
  const { id } = req.params;
  const { name, stoneType, wallPosition, description } = req.body;

  // Find image
  const image = await InteriorImage.findById(id);

  if (!image) {
    throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND('Hình ảnh'));
  }

  // Validation
  if (!name || !stoneType || !wallPosition) {
    throw new BadRequestError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
  }

  // Update fields
  image.name = name;
  image.stoneType = stoneType;
  image.wallPosition = wallPosition;
  if (description !== undefined) {
    image.description = description;
  }

  // If new image uploaded, delete old one and update
  if (req.file) {
    // Delete old image
    await deleteFile(image.imageUrl);

    // Update with new image
    image.imageUrl = getImageUrl(req.file);
    image.cloudinaryPublicId = getCloudinaryPublicId(req.file);
  }

  try {
    await image.save();
    return sendSuccess(res, image, SUCCESS_MESSAGES.UPDATED('hình ảnh'));
  } catch (error) {
    // Delete new file if there's an error
    if (req.file) {
      const newImageUrl = getImageUrl(req.file);
      if (newImageUrl) {
        await deleteFile(newImageUrl);
      }
    }
    throw error;
  }
};

/**
 * Delete image (Admin only)
 * DELETE /api/admin/images/:id
 */
const deleteImage = async (req, res) => {
  const { id } = req.params;

  const image = await InteriorImage.findById(id);

  if (!image) {
    throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND('Hình ảnh'));
  }

  // Delete image file (supports both Cloudinary and local)
  await deleteFile(image.imageUrl);

  // Delete document
  await InteriorImage.findByIdAndDelete(id);

  return sendSuccess(res, null, SUCCESS_MESSAGES.DELETED('hình ảnh'));
};

module.exports = {
  createImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage
};

