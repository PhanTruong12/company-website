// adminAuth.controller.js - Controller cho Admin Authentication
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

/**
 * Tạo JWT token cho admin
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-production-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d' // Mặc định 7 ngày
  });
};

/**
 * Đăng nhập Admin
 * POST /api/admin/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ email và mật khẩu.'
      });
    }

    // Tìm admin theo email
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng.'
      });
    }

    // Kiểm tra password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng.'
      });
    }

    // Kiểm tra role phải là admin hoặc staff
    if (admin.role !== 'admin' && admin.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản không có quyền truy cập.'
      });
    }

    // Tạo token
    const token = generateToken(admin._id);

    // Trả về thông tin admin (không bao gồm password)
    res.json({
      success: true,
      message: 'Đăng nhập thành công.',
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role
        }
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
 * Lấy thông tin admin hiện tại (từ token)
 * GET /api/admin/me
 * Protected: verifyAdminToken
 */
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản.'
      });
    }

    res.json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

module.exports = {
  login,
  getMe
};

