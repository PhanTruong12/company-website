// interiorImageRoutes.js - Routes cho InteriorImage API
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createInteriorImage,
  getInteriorImages,
  getInteriorImageById,
  updateInteriorImage,
  deleteInteriorImage
} = require('../controllers/interiorImageController');

/**
 * POST /api/interior-images
 * Thêm hình ảnh mới (multipart/form-data)
 */
router.post('/', upload.single('image'), createInteriorImage);

/**
 * GET /api/interior-images
 * Lấy danh sách hình ảnh (có thể filter theo stoneType, wallPosition)
 */
router.get('/', getInteriorImages);

/**
 * GET /api/interior-images/:id
 * Lấy chi tiết 1 hình ảnh
 */
router.get('/:id', getInteriorImageById);

/**
 * PUT /api/interior-images/:id
 * Cập nhật thông tin + ảnh (ảnh là optional)
 */
router.put('/:id', upload.single('image'), updateInteriorImage);

/**
 * DELETE /api/interior-images/:id
 * Xóa hình ảnh + file ảnh trong server
 */
router.delete('/:id', deleteInteriorImage);

module.exports = router;

