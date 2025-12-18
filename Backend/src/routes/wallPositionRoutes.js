// wallPositionRoutes.js - Routes cho Wall Position API
const express = require('express');
const router = express.Router();
const { getWallPositions } = require('../controllers/wallPositionController');

/**
 * GET /api/wall-positions
 * Lấy danh sách vị trí ốp
 */
router.get('/', getWallPositions);

module.exports = router;

