// adminAuth.controller.js - Admin Authentication Controller
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError, NotFoundError } = require('../utils/errors/AppError');
const { sendSuccess } = require('../utils/response');
const { ERROR_MESSAGES, SUCCESS_MESSAGES, JWT, ROLES } = require('../constants');
const { getEnv } = require('../config/env');

/**
 * Generate JWT token for admin
 */
const generateToken = (id) => {
  const secret = getEnv('JWT_SECRET', 'your-production-secret-key');
  const expiresIn = getEnv('JWT_EXPIRES_IN', JWT.DEFAULT_EXPIRES_IN);
  
  return jwt.sign({ id }, secret, { expiresIn });
};

/**
 * Admin Login
 * POST /api/admin/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new UnauthorizedError(ERROR_MESSAGES.REQUIRED_FIELD('Email và mật khẩu'));
  }

  // Find admin by email
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  
  if (!admin) {
    throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Check password
  const isPasswordValid = await admin.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Check role must be admin or staff
  if (admin.role !== ROLES.ADMIN && admin.role !== ROLES.STAFF) {
    throw new ForbiddenError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  // Generate token
  const token = generateToken(admin._id);

  // Return admin info (without password)
  return sendSuccess(res, {
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role
    }
  }, SUCCESS_MESSAGES.LOGIN_SUCCESS);
};

/**
 * Get current admin info (from token)
 * GET /api/admin/me
 * Protected: verifyAdminToken
 */
const getMe = async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('-password');
  
  if (!admin) {
    throw new NotFoundError(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
  }

  return sendSuccess(res, {
    id: admin._id,
    email: admin.email,
    role: admin.role
  });
};

module.exports = {
  login,
  getMe
};

