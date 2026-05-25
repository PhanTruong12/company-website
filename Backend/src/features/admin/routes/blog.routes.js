const express = require('express');
const { verifyAdminToken } = require('../../../core/middleware/auth.middleware');
const upload = require('../../../core/middleware/uploadMiddleware');
const blogController = require('../controllers/blog.controller');

const router = express.Router();

router.get('/', verifyAdminToken, blogController.getPosts);
router.post('/', verifyAdminToken, blogController.createPost);
router.put('/:id', verifyAdminToken, blogController.updatePost);
router.delete('/:id', verifyAdminToken, blogController.deletePost);

// Upload blog cover image → returns Cloudinary/server URL
router.post('/upload-cover', verifyAdminToken, upload.single('cover'), blogController.uploadCover);

module.exports = router;
