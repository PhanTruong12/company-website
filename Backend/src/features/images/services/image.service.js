// features/images/services/image.service.js - Image business logic
const InteriorImage = require('../models/InteriorImage');
const { NotFoundError, BadRequestError } = require('../../../shared/utils/errors/AppError');
const { ERROR_MESSAGES } = require('../../../shared/constants');
const { getImageUrl, getCloudinaryPublicId, deleteFile } = require('../../../shared/utils/fileHelper');

/**
 * Create new interior image
 */
const createImage = async (data, file) => {
  const { name, stoneType, wallPosition, description } = data;

  if (!name || !stoneType || !wallPosition) {
    throw new BadRequestError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
  }

  if (!file) {
    throw new BadRequestError(ERROR_MESSAGES.FILE_REQUIRED);
  }

  const imageUrl = getImageUrl(file);
  const cloudinaryPublicId = getCloudinaryPublicId(file);

  try {
    const interiorImage = new InteriorImage({
      name,
      stoneType,
      wallPosition,
      description: description || '',
      imageUrl,
      ...(cloudinaryPublicId && { cloudinaryPublicId })
    });

    await interiorImage.save();
    return interiorImage;
  } catch (error) {
    // Delete uploaded file if there's an error
    if (file && imageUrl) {
      await deleteFile(imageUrl);
    }
    throw error;
  }
};

/**
 * Get images with filters and pagination
 */
const getImages = async (filters = {}, pagination = {}) => {
  const { stoneType, wallPosition } = filters;
  const { page = 1, limit = 10 } = pagination;

  const filter = {};
  if (stoneType) filter.stoneType = stoneType;
  if (wallPosition) filter.wallPosition = wallPosition;

  const skip = (page - 1) * limit;
  const total = await InteriorImage.countDocuments(filter);
  const images = await InteriorImage.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    images,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get all images (no pagination) - for public API
 */
const getAllImages = async (filters = {}) => {
  const { stoneType, wallPosition } = filters;
  const filter = {};

  if (stoneType) filter.stoneType = stoneType;
  if (wallPosition) filter.wallPosition = wallPosition;

  const images = await InteriorImage.find(filter).sort({ createdAt: -1 });
  return images;
};

/**
 * Get image by ID
 */
const getImageById = async (id) => {
  const image = await InteriorImage.findById(id);
  if (!image) {
    throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND('Hình ảnh'));
  }
  return image;
};

/**
 * Update image
 */
const updateImage = async (id, data, file) => {
  const { name, stoneType, wallPosition, description } = data;

  const image = await InteriorImage.findById(id);
  if (!image) {
    throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND('Hình ảnh'));
  }

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

  // If new file uploaded, delete old file and update
  if (file) {
    const oldImageUrl = image.imageUrl;
    const imageUrl = getImageUrl(file);
    const cloudinaryPublicId = getCloudinaryPublicId(file);

    // Delete old file
    if (oldImageUrl) {
      await deleteFile(oldImageUrl);
    }

    // Update with new file
    image.imageUrl = imageUrl;
    if (cloudinaryPublicId) {
      image.cloudinaryPublicId = cloudinaryPublicId;
    }
  }

  await image.save();
  return image;
};

/**
 * Delete image
 */
const deleteImage = async (id) => {
  const image = await InteriorImage.findById(id);
  if (!image) {
    throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND('Hình ảnh'));
  }

  // Delete file
  if (image.imageUrl) {
    await deleteFile(image.imageUrl);
  }

  // Delete document
  await InteriorImage.findByIdAndDelete(id);
  return true;
};

module.exports = {
  createImage,
  getImages,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage
};
