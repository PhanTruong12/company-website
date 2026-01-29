// features/admin/services/auth.service.js - Admin authentication service
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError, NotFoundError } = require('../../../shared/utils/errors/AppError');
const { ERROR_MESSAGES, ROLES, JWT } = require('../../../shared/constants');
const { getEnv } = require('../../../config/env');

/**
 * Generate JWT token for admin
 */
const generateToken = (id) => {
  const secret = getEnv('JWT_SECRET', 'your-production-secret-key');
  const expiresIn = getEnv('JWT_EXPIRES_IN', JWT.DEFAULT_EXPIRES_IN);
  return jwt.sign({ id }, secret, { expiresIn });
};

/**
 * Login admin
 */
const login = async (email, password) => {
  if (!email || !password) {
    throw new UnauthorizedError(ERROR_MESSAGES.REQUIRED_FIELD('Email và mật khẩu'));
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  
  if (!admin) {
    throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await admin.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  if (admin.role !== ROLES.ADMIN && admin.role !== ROLES.STAFF) {
    throw new ForbiddenError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  const token = generateToken(admin._id);

  return {
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role
    }
  };
};

/**
 * Get admin by ID
 */
const getAdminById = async (id) => {
  const admin = await Admin.findById(id).select('-password');
  
  if (!admin) {
    throw new NotFoundError(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
  }

  return {
    id: admin._id,
    email: admin.email,
    role: admin.role
  };
};

module.exports = {
  login,
  getAdminById
};
