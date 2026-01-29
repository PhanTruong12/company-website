// interiorImageController.js - Controller cho InteriorImage
const InteriorImage = require('../models/InteriorImage');
const fs = require('fs');
const path = require('path');
const { getImageUrl } = require('../utils/fileHelper');

/**
 * Tạo hình ảnh mới
 * POST /api/interior-images
 */
const createInteriorImage = async (req, res) => {
  try {
    // Validate dữ liệu
    const { name, stoneType, wallPosition, description } = req.body;

    if (!name || !stoneType || !wallPosition) {
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
      wallPosition,
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
    const filter = {};

    // Thêm filter nếu có
    if (stoneType) {
      filter.stoneType = stoneType;
    }
    if (wallPosition) {
      filter.wallPosition = wallPosition;
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
    const { name, stoneType, wallPosition, description } = req.body;

    // Tìm hình ảnh
    const image = await InteriorImage.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hình ảnh'
      });
    }

    // Validate dữ liệu
    if (!name || !stoneType || !wallPosition) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: name, stoneType, wallPosition'
      });
    }

    // Cập nhật thông tin
    image.name = name;
    image.stoneType = stoneType;
    image.wallPosition = wallPosition;
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

