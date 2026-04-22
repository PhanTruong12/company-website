// features/admin/routes/index.js - Admin routes aggregator
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const adminImageRoutes = require('../../images/routes/adminImage.routes');
const adminBlogRoutes = require('./blog.routes');
const adminTrafficRoutes = require('./traffic.routes');

// Auth routes
router.use('/', authRoutes);

// Admin image routes
router.use('/images', adminImageRoutes);
router.use('/blogs', adminBlogRoutes);
router.use('/traffic', adminTrafficRoutes);

module.exports = router;
