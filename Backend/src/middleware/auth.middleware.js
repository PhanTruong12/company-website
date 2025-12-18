// auth.middleware.js - Middleware xác thực JWT cho Admin
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Middleware xác thực JWT token cho Admin
 * Kiểm tra token từ header Authorization: Bearer <token>
 */
const verifyAdminToken = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực. Vui lòng đăng nhập.'
      });
    }

    const token = authHeader.substring(7); // Bỏ "Bearer " prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-production-secret-key');

    // Kiểm tra admin có tồn tại không
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại.'
      });
    }

    // Kiểm tra role phải là admin hoặc staff
    if (admin.role !== 'admin' && admin.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập.'
      });
    }

    // Gắn thông tin admin vào request để sử dụng ở các route tiếp theo
    req.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực: ' + error.message
    });
  }
};

module.exports = {
  verifyAdminToken
};

