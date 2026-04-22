const express = require('express');
const postController = require('../controllers/post.controller');

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/:id/react', postController.reactPost);

module.exports = router;
