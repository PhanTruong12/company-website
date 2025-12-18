// auth.middleware.js - JWT Authentication Middleware for Admin
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors/AppError');
const { ERROR_MESSAGES, ROLES } = require('../constants');
const { getEnv } = require('../config/env');

/**
 * Middleware to verify JWT token for Admin
 * Checks token from Authorization header: Bearer <token>
 */
const verifyAdminToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Verify token
    const secret = getEnv('JWT_SECRET', 'your-production-secret-key');
    const decoded = jwt.verify(token, secret);

    // Check if admin exists
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      throw new UnauthorizedError(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    // Check role must be admin or staff
    if (admin.role !== ROLES.ADMIN && admin.role !== ROLES.STAFF) {
      throw new ForbiddenError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
    }

    // Attach admin info to request for use in subsequent routes
    req.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role
    };

    next();
  } catch (error) {
    // JWT errors are handled by error handler middleware
    next(error);
  }
};

module.exports = {
  verifyAdminToken
};

