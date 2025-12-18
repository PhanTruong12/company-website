// searchRoutes.js - Routes cho Search API
const express = require('express');
const router = express.Router();
const { searchStones } = require('../controllers/searchController');

/**
 * GET /api/search/stones?q=
 * Search đá bằng Elasticsearch (hoặc MongoDB fallback)
 */
router.get('/stones', searchStones);

module.exports = router;

