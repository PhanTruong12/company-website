// wallPositionController.js - Controller cho Wall Position API
// Sử dụng InteriorImage model để lấy danh sách wallPosition unique
const InteriorImage = require('../models/InteriorImage');

/**
 * Lấy danh sách vị trí ốp (từ InteriorImage)
 * GET /api/wall-positions
 */
const getWallPositions = async (req, res) => {
  try {
    // Lấy danh sách vị trí unique từ InteriorImage
    const wallPositions = await InteriorImage.distinct('wallPosition');

    // Format thành array objects giống với StoneType
    const formattedPositions = wallPositions
      .filter(pos => pos) // Loại bỏ null/undefined
      .map((position, index) => ({
        _id: `wp_${index}`,
        name: position,
        isActive: true
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      message: 'Lấy danh sách vị trí ốp thành công',
      data: formattedPositions,
      count: formattedPositions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

module.exports = {
  getWallPositions
};

