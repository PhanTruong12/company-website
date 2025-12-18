// admin.routes.js - Admin API Routes
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { verifyAdminToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/uploadMiddleware');
const { login, getMe } = require('../controllers/adminAuth.controller');
const {
  createImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage
} = require('../controllers/adminImage.controller');

/**
 * Authentication Routes (Public)
 */
router.post('/login', asyncHandler(login));
router.get('/me', verifyAdminToken, asyncHandler(getMe));

/**
 * Image CRUD Routes (Protected - Admin only)
 * All routes below are protected by verifyAdminToken middleware
 * Upload middleware automatically selects Cloudinary or Local Storage
 */
router.post('/images', verifyAdminToken, upload.single('image'), asyncHandler(createImage));
router.get('/images', verifyAdminToken, asyncHandler(getImages));
router.get('/images/:id', verifyAdminToken, asyncHandler(getImageById));
router.put('/images/:id', verifyAdminToken, upload.single('image'), asyncHandler(updateImage));
router.delete('/images/:id', verifyAdminToken, asyncHandler(deleteImage));

module.exports = router;

