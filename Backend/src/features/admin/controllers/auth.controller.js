// features/admin/controllers/auth.controller.js - Admin auth controller
const authService = require('../services/auth.service');
const { sendSuccess } = require('../../../shared/utils/response');
const { SUCCESS_MESSAGES } = require('../../../shared/constants');
const asyncHandler = require('../../../core/middleware/asyncHandler');

/**
 * Admin Login
 * POST /api/admin/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return sendSuccess(res, result, SUCCESS_MESSAGES.LOGIN_SUCCESS);
});

/**
 * Get current admin info
 * GET /api/admin/me
 */
const getMe = asyncHandler(async (req, res) => {
  const admin = await authService.getAdminById(req.admin.id);
  return sendSuccess(res, admin);
});

module.exports = {
  login,
  getMe
};
