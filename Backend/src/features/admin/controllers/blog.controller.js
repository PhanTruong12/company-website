const mongoose = require('mongoose');
const Post = require('../../../models/Post');
const { sendSuccess } = require('../../../shared/utils/response');
const { HTTP_STATUS } = require('../../../shared/constants');
const { BadRequestError, NotFoundError } = require('../../../shared/utils/errors/AppError');
const { emitPostsUpdated } = require('../../../realtime/events');
const { createUniquePostSlug } = require('../../../utils/postSlug');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    sendSuccess(res, posts, 'Lấy danh sách blog thành công');
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, slug, description, content, coverImage } = req.body;
    if (!title?.trim() || !content?.trim()) {
      throw new BadRequestError('Vui lòng nhập đầy đủ tiêu đề và nội dung');
    }

    const post = await Post.create({
      title: title.trim(),
      slug: await createUniquePostSlug(Post, slug || title),
      description: typeof description === 'string' ? description.trim() : '',
      content: content.trim(),
      coverImage: typeof coverImage === 'string' ? coverImage.trim() : '',
    });
    emitPostsUpdated({ action: 'created', post });

    sendSuccess(res, post, 'Tạo blog thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError('ID blog không hợp lệ');
    }

    const post = await Post.findById(id);
    if (!post) {
      throw new NotFoundError('Blog không tồn tại');
    }

    const { title, slug, description, content, coverImage } = req.body;
    if (title != null) post.title = String(title).trim();
    if (slug != null || title != null) {
      post.slug = await createUniquePostSlug(Post, slug || post.title, post._id);
    }
    if (description != null) post.description = String(description).trim();
    if (content != null) post.content = String(content).trim();
    if (coverImage != null) post.coverImage = String(coverImage).trim();
    await post.save();
    emitPostsUpdated({ action: 'updated', post });

    sendSuccess(res, post, 'Cập nhật blog thành công');
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError('ID blog không hợp lệ');
    }

    const post = await Post.findById(id);
    if (!post) {
      throw new NotFoundError('Blog không tồn tại');
    }

    const postId = String(post._id);
    await post.deleteOne();
    emitPostsUpdated({ action: 'deleted', postId });
    sendSuccess(res, null, 'Xóa blog thành công');
  } catch (error) {
    next(error);
  }
};
