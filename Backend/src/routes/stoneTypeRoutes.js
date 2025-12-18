// stoneTypeRoutes.js - Routes cho StoneType API
const express = require('express');
const router = express.Router();
const { getStoneTypes } = require('../controllers/stoneTypeController');

/**
 * GET /api/stone-types
 * Lấy danh sách loại đá
 */
router.get('/', getStoneTypes);

module.exports = router;

