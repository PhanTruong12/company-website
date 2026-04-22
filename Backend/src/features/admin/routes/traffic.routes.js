const express = require('express');
const { verifyAdminToken } = require('../../../core/middleware/auth.middleware');
const trafficController = require('../controllers/traffic.controller');

const router = express.Router();

router.get('/summary', verifyAdminToken, trafficController.getTrafficSummary);

module.exports = router;
