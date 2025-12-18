// adminImage.controller.js - Controller cho Admin CRUD InteriorImage
// Tất cả routes đều được bảo vệ bởi verifyAdminToken middleware
// Hỗ trợ cả Cloudinary và Local Storage
const InteriorImage = require('../models/InteriorImage');
const fs = require('fs');
const path = require('path');

// Helper function để kiểm tra xem URL có phải Cloudinary không
const isCloudinaryUrl = (url) => {
  return url && (url.includes('cloudinary.com') || url.includes('res.cloudinary.com'));
};

// Helper function để xóa file từ Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    const cloudinary = require('../config/cloudinary');
    
    // Extract public_id từ URL
    // Format: https://res.cloudinary.com/cloud-name/image/upload/v123/folder/public_id.jpg
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return;
    
    // Lấy phần sau 'upload'
    const afterUpload = urlParts.slice(uploadIndex + 1);
    // Bỏ qua version (v123) nếu có
    const pathParts = afterUpload.filter(part => !part.startsWith('v'));
    // Join lại để có public_id
    const publicId = pathParts.join('/').replace(/\.[^/.]+$/, ''); // Bỏ extension
    
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      return true;
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error.message);
    return false;
  }
  return false;
};

// Helper function để xóa file local
const deleteLocalFile = (imageUrl) => {
  try {
    const filePath = path.join(__dirname, '../../', imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (error) {
    console.error('Error deleting local file:', error.message);
  }
  return false;
};

/**
 * Tạo hình ảnh mới (Admin only)
 * POST /api/admin/images
 */
const createImage = async (req, res) => {
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

    // Xác định imageUrl dựa trên loại storage
    let imageUrl;
    let cloudinaryPublicId = null;

    // Kiểm tra xem có phải Cloudinary upload không
    if (req.file.secure_url || req.file.url) {
      // Cloudinary upload
      imageUrl = req.file.secure_url || req.file.url;
      cloudinaryPublicId = req.file.public_id || null;
    } else {
      // Local storage upload
      imageUrl = `/uploads/interior-images/${req.file.filename}`;
    }

    // Tạo document mới
    const interiorImage = new InteriorImage({
      name,
      stoneType,
      wallPosition,
      description: description || '',
      imageUrl,
      ...(cloudinaryPublicId && { cloudinaryPublicId }) // Lưu public_id nếu có
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
      if (req.file.secure_url || req.file.url) {
        // Xóa từ Cloudinary nếu có
        if (req.file.public_id) {
          try {
            const cloudinary = require('../config/cloudinary');
            await cloudinary.uploader.destroy(req.file.public_id);
          } catch (cloudinaryError) {
            console.error('Error deleting from Cloudinary:', cloudinaryError);
          }
        }
      } else {
        // Xóa file local
        const filePath = path.join(__dirname, '../../uploads/interior-images', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Lấy danh sách hình ảnh (Admin only)
 * GET /api/admin/images
 * Query params: stoneType, wallPosition, page, limit
 */
const getImages = async (req, res) => {
  try {
    const { stoneType, wallPosition, page = 1, limit = 50 } = req.query;
    const filter = {};

    // Thêm filter nếu có
    if (stoneType) {
      filter.stoneType = stoneType;
    }
    if (wallPosition) {
      filter.wallPosition = wallPosition;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Lấy tổng số records
    const total = await InteriorImage.countDocuments(filter);

    // Lấy danh sách với pagination
    const images = await InteriorImage.find(filter)
      .sort({ createdAt: -1 }) // Sắp xếp mới nhất trước
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      message: 'Lấy danh sách hình ảnh thành công',
      data: images,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Lấy chi tiết 1 hình ảnh (Admin only)
 * GET /api/admin/images/:id
 */
const getImageById = async (req, res) => {
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
 * Cập nhật hình ảnh (Admin only)
 * PUT /api/admin/images/:id
 */
const updateImage = async (req, res) => {
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
      // Xóa ảnh cũ (hỗ trợ cả Cloudinary và local)
      if (isCloudinaryUrl(image.imageUrl)) {
        // Xóa từ Cloudinary
        if (image.cloudinaryPublicId) {
          try {
            const cloudinary = require('../config/cloudinary');
            await cloudinary.uploader.destroy(image.cloudinaryPublicId);
          } catch (error) {
            console.error('Error deleting old image from Cloudinary:', error);
          }
        } else {
          // Fallback: xóa bằng URL
          await deleteFromCloudinary(image.imageUrl);
        }
      } else {
        // Xóa file local
        deleteLocalFile(image.imageUrl);
      }

      // Cập nhật đường dẫn ảnh mới
      if (req.file.secure_url || req.file.url) {
        // Cloudinary upload
        image.imageUrl = req.file.secure_url || req.file.url;
        image.cloudinaryPublicId = req.file.public_id || null;
      } else {
        // Local storage upload
        image.imageUrl = `/uploads/interior-images/${req.file.filename}`;
        image.cloudinaryPublicId = null;
      }
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
      if (req.file.secure_url || req.file.url) {
        // Xóa từ Cloudinary nếu có
        if (req.file.public_id) {
          try {
            const cloudinary = require('../config/cloudinary');
            await cloudinary.uploader.destroy(req.file.public_id);
          } catch (cloudinaryError) {
            console.error('Error deleting from Cloudinary:', cloudinaryError);
          }
        }
      } else {
        // Xóa file local
        const filePath = path.join(__dirname, '../../uploads/interior-images', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Xóa hình ảnh (Admin only)
 * DELETE /api/admin/images/:id
 */
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await InteriorImage.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hình ảnh'
      });
    }

    // Xóa file ảnh (hỗ trợ cả Cloudinary và local)
    if (isCloudinaryUrl(image.imageUrl)) {
      // Xóa từ Cloudinary
      if (image.cloudinaryPublicId) {
        try {
          const cloudinary = require('../config/cloudinary');
          await cloudinary.uploader.destroy(image.cloudinaryPublicId);
        } catch (error) {
          console.error('Error deleting from Cloudinary:', error);
          // Tiếp tục xóa document dù Cloudinary có lỗi
        }
      } else {
        // Fallback: xóa bằng URL
        await deleteFromCloudinary(image.imageUrl);
      }
    } else {
      // Xóa file local
      deleteLocalFile(image.imageUrl);
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
  createImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage
};

