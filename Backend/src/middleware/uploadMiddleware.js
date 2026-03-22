// middleware/uploadMiddleware.js — single entry re-exports core selector (avoid drift)
// Fix: prevent uploaded images from being removed after deploy
module.exports = require('../core/middleware/uploadMiddleware');
