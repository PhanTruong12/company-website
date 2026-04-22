const express = require('express');
const { verifyAdminToken } = require('../../../core/middleware/auth.middleware');
const blogController = require('../controllers/blog.controller');

const router = express.Router();

router.get('/', verifyAdminToken, blogController.getPosts);
router.post('/', verifyAdminToken, blogController.createPost);
router.put('/:id', verifyAdminToken, blogController.updatePost);
router.delete('/:id', verifyAdminToken, blogController.deletePost);

module.exports = router;
