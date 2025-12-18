// stoneTypeController.js - Controller cho StoneType API
// Lấy dữ liệu từ InteriorImage collection thay vì StoneType riêng
const InteriorImage = require('../models/InteriorImage');

/**
 * Helper function để convert tiếng Việt có dấu sang không dấu
 */
const removeVietnameseTones = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
};

/**
 * Helper function để tạo slug từ tên
 */
const createSlug = (name) => {
  let slug = removeVietnameseTones(name.toLowerCase());
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');
  return slug;
};

/**
 * Danh sách loại đá mặc định (để đảm bảo Admin luôn có đầy đủ lựa chọn)
 */
const DEFAULT_STONE_TYPES = [
  'Đá thạch anh',
  'Đá nung kết',
  'Đá tự nhiên',
  'Thạch Anh',
  'Nung Kết',
  'Tự Nhiên'
];

/**
 * Helper function để normalize tên loại đá (loại bỏ khoảng trắng thừa, chuẩn hóa)
 */
const normalizeStoneTypeName = (name) => {
  if (!name) return '';
  return name.trim().replace(/\s+/g, ' ');
};

/**
 * Helper function để so sánh 2 tên loại đá (case-insensitive, không phân biệt dấu)
 */
const areStoneTypesEqual = (name1, name2) => {
  const normalized1 = normalizeStoneTypeName(name1).toLowerCase();
  const normalized2 = normalizeStoneTypeName(name2).toLowerCase();
  
  // So sánh trực tiếp
  if (normalized1 === normalized2) return true;
  
  // So sánh sau khi loại bỏ "Đá" ở đầu
  const withoutPrefix1 = normalized1.replace(/^đá\s+/, '');
  const withoutPrefix2 = normalized2.replace(/^đá\s+/, '');
  if (withoutPrefix1 === withoutPrefix2) return true;
  
  return false;
};

/**
 * Lấy danh sách loại đá từ InteriorImage collection + danh sách mặc định
 * GET /api/stone-types
 * 
 * Logic:
 * 1. Lấy distinct từ InteriorImage (các loại đá đã được sử dụng)
 * 2. Merge với danh sách mặc định
 * 3. Loại bỏ trùng lặp (case-insensitive, normalize)
 * 4. Trả về danh sách đầy đủ
 */
const getStoneTypes = async (req, res) => {
  try {
    // Kiểm tra database connection trước
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // Database chưa kết nối, trả về danh sách mặc định
      console.warn('⚠️  Database not connected, returning default stone types');
      const defaultTypes = DEFAULT_STONE_TYPES.map((type, index) => ({
        _id: `st_${index}`,
        name: type,
        slug: createSlug(type),
        isActive: true
      })).sort((a, b) => a.name.localeCompare(b.name));
      
      return res.json({
        success: true,
        message: 'Lấy danh sách loại đá thành công (default)',
        data: defaultTypes,
        count: defaultTypes.length
      });
    }
    
    // 1. Lấy danh sách stoneType unique từ InteriorImage (các loại đá đã được sử dụng)
    const usedStoneTypes = await InteriorImage.distinct('stoneType');
    
    // 2. Tạo Map để lưu các loại đá (key: normalized lowercase, value: best name)
    const stoneTypeMap = new Map();
    
    // Helper function để thêm loại đá vào Map (ưu tiên tên dài hơn/đầy đủ hơn)
    const addStoneType = (typeName) => {
      if (!typeName || !typeName.trim()) return;
      
      const normalized = normalizeStoneTypeName(typeName);
      const key = normalized.toLowerCase();
      
      // Kiểm tra xem đã có loại đá tương tự chưa
      let foundSimilarKey = null;
      let foundSimilarName = null;
      
      for (const [existingKey, existingName] of stoneTypeMap.entries()) {
        if (areStoneTypesEqual(existingName, normalized)) {
          foundSimilarKey = existingKey;
          foundSimilarName = existingName;
          break;
        }
      }
      
      if (foundSimilarKey) {
        // Đã có loại đá tương tự, cập nhật nếu tên mới đầy đủ hơn
        if (normalized.length > foundSimilarName.length) {
          // Xóa key cũ và thêm lại với key mới (hoặc cập nhật key cũ)
          stoneTypeMap.delete(foundSimilarKey);
          stoneTypeMap.set(key, normalized);
        }
        // Nếu không đầy đủ hơn, giữ nguyên
      } else {
        // Chưa có loại đá tương tự, thêm vào
        stoneTypeMap.set(key, normalized);
      }
    };
    
    // 3. Thêm các loại đá từ database (ưu tiên giữ nguyên tên gốc)
    usedStoneTypes.forEach(addStoneType);
    
    // 4. Thêm các loại đá mặc định (đảm bảo luôn có đầy đủ lựa chọn)
    DEFAULT_STONE_TYPES.forEach(addStoneType);
    
    // 5. Format thành array objects giống với StoneType model
    const formattedStoneTypes = Array.from(stoneTypeMap.values())
      .map((type, index) => ({
        _id: `st_${index}`,
        name: type,
        slug: createSlug(type),
        isActive: true
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp theo tên

    res.json({
      success: true,
      message: 'Lấy danh sách loại đá thành công',
      data: formattedStoneTypes,
      count: formattedStoneTypes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

module.exports = {
  getStoneTypes
};

