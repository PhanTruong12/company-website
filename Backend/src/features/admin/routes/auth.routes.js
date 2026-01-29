// features/admin/routes/auth.routes.js - Admin auth routes
const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../../../core/middleware/auth.middleware');
const { login, getMe } = require('../controllers/auth.controller');

/**
 * POST /api/admin/login
 * Admin login
 */
router.post('/login', login);

/**
 * GET /api/admin/me
 * Get current admin info (protected)
 */
router.get('/me', verifyAdminToken, getMe);

module.exports = router;
