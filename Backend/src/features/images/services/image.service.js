// features/images/services/image.service.js - Image business logic
const InteriorImage = require('../models/InteriorImage');
const { NotFoundError, BadRequestError } = require('../../../shared/utils/errors/AppError');
const { ERROR_MESSAGES } = require('../../../shared/constants');
const { getImageUrl, getCloudinaryPublicId, deleteFile } = require('../../../shared/utils/fileHelper');

const normalizeWallPositions = (value) => {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((item) => (typeof item === 'string' ? item.split(',') : []))
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeStoneTypeDisplay = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
};

const normalizeStoneTypeKey = (value) =>
  normalizeStoneTypeDisplay(value).toLocaleLowerCase('vi');

const splitStoneTypeValues = (value) => {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((item) => (typeof item === 'string' ? item.split(',') : []))
    .map(normalizeStoneTypeDisplay)
    .filter(Boolean);
};

const dedupeStoneTypes = (values) => {
  const byKey = new Map();
  values.forEach((item) => {
    const key = normalizeStoneTypeKey(item);
    if (!key) return;
    if (!byKey.has(key)) {
      byKey.set(key, item);
    }
  });
  return [...byKey.values()];
};

const getStoneTypesFromInput = (data = {}) => {
  const list = splitStoneTypeValues(data.stoneTypes ?? data.stoneType);
  return dedupeStoneTypes(list);
};

const getStoneTypesFromImage = (image = {}) => {
  const list = splitStoneTypeValues(image.stoneType);
  return dedupeStoneTypes(list);
};

const normalizeSurfaceDisplay = (value) => {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/\s+/g, ' ');
};

const normalizeSurfaceKey = (value) =>
  normalizeSurfaceDisplay(value).toLocaleLowerCase('vi');

const splitSurfaceValues = (value) => {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((item) => (typeof item === 'string' ? item.split(',') : []))
    .map(normalizeSurfaceDisplay)
    .filter(Boolean);
};

const dedupeSurfaces = (values) => {
  const byKey = new Map();
  values.forEach((item) => {
    const key = normalizeSurfaceKey(item);
    if (!key) return;
    if (!byKey.has(key)) {
      byKey.set(key, item);
    }
  });
  return [...byKey.values()];
};

const getSurfacesFromInput = (data = {}) => {
  const surfaces = splitSurfaceValues(data.be_mat ?? data.hang_muc ?? data.category);
  return dedupeSurfaces(surfaces);
};

const getSurfacesFromImage = (image = {}) => {
  const surfaces = splitSurfaceValues(image.be_mat ?? image.hang_muc ?? image.category);
  return dedupeSurfaces(surfaces);
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const mapImageOutput = (doc) => {
  if (!doc) return doc;
  const image = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  const stoneType = getStoneTypesFromImage(image);
  const be_mat = getSurfacesFromImage(image);
  return {
    ...image,
    stoneType: stoneType.length > 0 ? stoneType : null,
    be_mat: be_mat.length > 0 ? be_mat : null
  };
};

/**
 * Create new interior image
 */
const createImage = async (data, file) => {
  const { name, description } = data;
  const stoneType = getStoneTypesFromInput(data);
  const stoneType_norm = stoneType.map(normalizeStoneTypeKey).filter(Boolean);
  const be_mat = getSurfacesFromInput(data);
  const be_mat_norm = be_mat.map(normalizeSurfaceKey).filter(Boolean);
  const wallPositions = normalizeWallPositions(data.wallPositions ?? data.wallPosition);

  if (!name || stoneType.length === 0 || wallPositions.length === 0) {
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
      stoneType_norm,
      be_mat,
      be_mat_norm,
      wallPosition: wallPositions,
      description: description || '',
      imageUrl,
      ...(cloudinaryPublicId && { cloudinaryPublicId })
    });

    await interiorImage.save();
    return mapImageOutput(interiorImage);
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
  const { wallPosition } = filters;
  const stoneType = normalizeStoneTypeDisplay(filters.stoneType);
  const stoneType_norm = stoneType ? normalizeStoneTypeKey(stoneType) : '';
  const be_mat = normalizeSurfaceDisplay(filters.be_mat ?? filters.hang_muc ?? filters.category);
  const be_mat_norm = be_mat ? normalizeSurfaceKey(be_mat) : '';
  const { page = 1, limit = 10 } = pagination;

  const filter = {};
  if (stoneType_norm) {
    const fallbackRegex = new RegExp(`^${escapeRegex(stoneType)}$`, 'i');
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { stoneType_norm: stoneType_norm },
          { stoneType: fallbackRegex }
        ]
      }
    ];
  }
  if (be_mat_norm) {
    const fallbackRegex = new RegExp(`^${escapeRegex(be_mat)}$`, 'i');
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { be_mat_norm: be_mat_norm },
          { be_mat: fallbackRegex },
          { hang_muc: fallbackRegex },
          { category: fallbackRegex }
        ]
      }
    ];
  }
  if (wallPosition) {
    const positions = normalizeWallPositions(wallPosition);
    if (positions.length === 1) {
      filter.wallPosition = positions[0];
    } else if (positions.length > 1) {
      filter.wallPosition = { $in: positions };
    }
  }

  const skip = (page - 1) * limit;
  const total = await InteriorImage.countDocuments(filter);
  const images = await InteriorImage.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    images: images.map(mapImageOutput),
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
  const { wallPosition } = filters;
  const stoneType = normalizeStoneTypeDisplay(filters.stoneType);
  const stoneType_norm = stoneType ? normalizeStoneTypeKey(stoneType) : '';
  const be_mat = normalizeSurfaceDisplay(filters.be_mat ?? filters.hang_muc ?? filters.category);
  const be_mat_norm = be_mat ? normalizeSurfaceKey(be_mat) : '';
  const filter = {};

  if (stoneType_norm) {
    const fallbackRegex = new RegExp(`^${escapeRegex(stoneType)}$`, 'i');
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { stoneType_norm: stoneType_norm },
          { stoneType: fallbackRegex }
        ]
      }
    ];
  }
  if (be_mat_norm) {
    const fallbackRegex = new RegExp(`^${escapeRegex(be_mat)}$`, 'i');
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { be_mat_norm: be_mat_norm },
          { be_mat: fallbackRegex },
          { hang_muc: fallbackRegex },
          { category: fallbackRegex }
        ]
      }
    ];
  }
  if (wallPosition) {
    const positions = normalizeWallPositions(wallPosition);
    if (positions.length === 1) {
      filter.wallPosition = positions[0];
    } else if (positions.length > 1) {
      filter.wallPosition = { $in: positions };
    }
  }

  const images = await InteriorImage.find(filter).sort({ createdAt: -1 });
  return images.map(mapImageOutput);
};

/**
 * Get image by ID
 */
const getImageById = async (id) => {
  const image = await InteriorImage.findById(id);
  if (!image) {
    throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND('Hình ảnh'));
  }
  return mapImageOutput(image);
};

/**
 * Update image
 */
const updateImage = async (id, data, file) => {
  const { name, description } = data;
  const stoneType = getStoneTypesFromInput(data);
  const stoneType_norm = stoneType.map(normalizeStoneTypeKey).filter(Boolean);
  const be_mat = getSurfacesFromInput(data);
  const be_mat_norm = be_mat.map(normalizeSurfaceKey).filter(Boolean);
  const wallPositions = normalizeWallPositions(data.wallPositions ?? data.wallPosition);

  const image = await InteriorImage.findById(id);
  if (!image) {
    throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND('Hình ảnh'));
  }

  if (!name || stoneType.length === 0 || wallPositions.length === 0) {
    throw new BadRequestError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
  }

  // Update fields
  image.name = name;
  image.stoneType = stoneType;
  image.stoneType_norm = stoneType_norm;
  image.be_mat = be_mat;
  image.be_mat_norm = be_mat_norm;
  image.wallPosition = wallPositions;
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
  return mapImageOutput(image);
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

const getSurfaces = async () => {
  const [fromBeMat, fromHangMuc, fromCategory] = await Promise.all([
    InteriorImage.distinct('be_mat'),
    InteriorImage.distinct('hang_muc'),
    InteriorImage.distinct('category')
  ]);
  const deduped = new Map();
  [...fromBeMat, ...fromHangMuc, ...fromCategory].forEach((value) => {
    splitSurfaceValues(value).forEach((display) => {
      const key = normalizeSurfaceKey(display);
      if (!deduped.has(key)) {
        deduped.set(key, display);
      }
    });
  });
  return [...deduped.values()].sort((a, b) => a.localeCompare(b, 'vi'));
};

module.exports = {
  createImage,
  getImages,
  getAllImages,
  getSurfaces,
  getImageById,
  updateImage,
  deleteImage
};
