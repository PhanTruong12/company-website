// searchController.js - Controller cho Elasticsearch Search API
// Giả định: Elasticsearch đã được setup và có index 'interior_stones'
// Nếu chưa có Elasticsearch, sẽ fallback về MongoDB search

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
 * Search đá bằng MongoDB (fallback nếu chưa có Elasticsearch)
 * GET /api/search/stones?q=
 */
const searchStones = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        message: 'Từ khóa tìm kiếm quá ngắn',
        data: [],
        count: 0
      });
    }

    const query = q.trim();
    const queryNoTones = removeVietnameseTones(query.toLowerCase());

    // Tìm kiếm với regex (hỗ trợ có dấu và không dấu)
    const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const searchRegexNoTones = new RegExp(queryNoTones.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    // Search trong name, stoneType, be_mat/hang_muc và wallPosition
    const results = await InteriorImage.find({
      $or: [
        { name: searchRegex },
        { name: { $regex: queryNoTones, $options: 'i' } },
        { stoneType: searchRegex },
        { stoneType: { $regex: queryNoTones, $options: 'i' } },
        { be_mat: searchRegex },
        { be_mat: { $regex: queryNoTones, $options: 'i' } },
        { hang_muc: searchRegex },
        { hang_muc: { $regex: queryNoTones, $options: 'i' } },
        { category: searchRegex },
        { category: { $regex: queryNoTones, $options: 'i' } },
        { wallPosition: searchRegex },
        { wallPosition: { $regex: queryNoTones, $options: 'i' } },
        { description: searchRegex }
      ]
    })
      .limit(10)
      .sort({ createdAt: -1 });

    // Format kết quả giống với Elasticsearch response
    const formattedResults = results.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      stoneType: item.stoneType,
      be_mat: item.be_mat || item.hang_muc || item.category || null,
      wallPosition: item.wallPosition,
      imageUrl: item.imageUrl,
      slug: createSlug(item.name)
    }));

    res.json({
      success: true,
      message: 'Tìm kiếm thành công',
      data: formattedResults,
      count: formattedResults.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

module.exports = {
  searchStones
};

