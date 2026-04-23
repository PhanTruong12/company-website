// interiorImageController.js - Controller cho InteriorImage
const InteriorImage = require('../models/InteriorImage');
const fs = require('fs');
const path = require('path');
const { getImageUrl } = require('../utils/fileHelper');

const normalizeWallPositions = (value) => {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((item) => (typeof item === 'string' ? item.split(',') : []))
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeSurface = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi');
};

/**
 * Tạo hình ảnh mới
 * POST /api/interior-images
 */
const createInteriorImage = async (req, res) => {
  try {
    // Validate dữ liệu
    const { name, stoneType, description } = req.body;
    const be_mat = normalizeSurface(req.body.be_mat ?? req.body.hang_muc ?? req.body.category);
    const wallPositions = normalizeWallPositions(req.body.wallPositions ?? req.body.wallPosition);

    if (!name || !stoneType || wallPositions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: name, stoneType, wallPosition'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng upload hình ảnh'
      });
    }

    // Tạo đường dẫn ảnh (tự động xử lý Cloudinary hoặc local storage)
    const imageUrl = getImageUrl(req.file);

    // Tạo document mới
    const interiorImage = new InteriorImage({
      name,
      stoneType,
      be_mat: be_mat || null,
      wallPosition: wallPositions,
      description: description || '',
      imageUrl
    });

    await interiorImage.save();

    res.status(201).json({
      success: true,
      message: 'Thêm hình ảnh thành công',
      data: interiorImage
    });
  } catch (error) {
    // Xóa file nếu có lỗi
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/interior-images', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Lấy danh sách hình ảnh (có thể filter)
 * GET /api/interior-images?stoneType=&wallPosition=
 */
const getInteriorImages = async (req, res) => {
  try {
    const { stoneType, wallPosition } = req.query;
    const be_mat = normalizeSurface(req.query.be_mat ?? req.query.hang_muc ?? req.query.category);
    const filter = {};

    // Thêm filter nếu có
    if (stoneType) {
      filter.stoneType = stoneType;
    }
    if (be_mat) {
      filter.$or = [{ be_mat }, { hang_muc: be_mat }, { category: be_mat }];
    }
    if (wallPosition) {
      const positions = normalizeWallPositions(wallPosition);
      if (positions.length === 1) {
        filter.wallPosition = positions[0];
      } else if (positions.length > 1) {
        filter.wallPosition = { $in: positions };
      }
    }

    const images = await InteriorImage.find(filter)
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước

    res.json({
      success: true,
      message: 'Lấy danh sách hình ảnh thành công',
      data: images,
      count: images.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Lấy chi tiết 1 hình ảnh
 * GET /api/interior-images/:id
 */
const getInteriorImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await InteriorImage.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hình ảnh'
      });
    }

    res.json({
      success: true,
      message: 'Lấy chi tiết hình ảnh thành công',
      data: image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Cập nhật hình ảnh
 * PUT /api/interior-images/:id
 */
const updateInteriorImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stoneType, description } = req.body;
    const be_mat = normalizeSurface(req.body.be_mat ?? req.body.hang_muc ?? req.body.category);
    const wallPositions = normalizeWallPositions(req.body.wallPositions ?? req.body.wallPosition);

    // Tìm hình ảnh
    const image = await InteriorImage.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hình ảnh'
      });
    }

    // Validate dữ liệu
    if (!name || !stoneType || wallPositions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: name, stoneType, wallPosition'
      });
    }

    // Cập nhật thông tin
    image.name = name;
    image.stoneType = stoneType;
    image.be_mat = be_mat || null;
    image.wallPosition = wallPositions;
    if (description !== undefined) {
      image.description = description;
    }

    // Nếu có ảnh mới, xóa ảnh cũ và cập nhật
    if (req.file) {
      // Xóa ảnh cũ
      const oldImagePath = path.join(__dirname, '../../', image.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Cập nhật đường dẫn ảnh mới (tự động xử lý Cloudinary hoặc local storage)
      image.imageUrl = getImageUrl(req.file);
    }

    await image.save();

    res.json({
      success: true,
      message: 'Cập nhật hình ảnh thành công',
      data: image
    });
  } catch (error) {
    // Xóa file mới nếu có lỗi
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/interior-images', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Xóa hình ảnh
 * DELETE /api/interior-images/:id
 */
const deleteInteriorImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await InteriorImage.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hình ảnh'
      });
    }

    // Xóa file ảnh
    const imagePath = path.join(__dirname, '../../', image.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Xóa document
    await InteriorImage.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Xóa hình ảnh thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

module.exports = {
  createInteriorImage,
  getInteriorImages,
  getInteriorImageById,
  updateInteriorImage,
  deleteInteriorImage
};

