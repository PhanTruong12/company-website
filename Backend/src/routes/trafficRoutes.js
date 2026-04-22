const express = require('express');
const trafficController = require('../controllers/traffic.controller');

const router = express.Router();

router.post('/track', trafficController.trackEvent);

module.exports = router;
