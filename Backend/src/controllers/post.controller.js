const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Post = require('../models/Post');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const { BadRequestError, NotFoundError } = require('../utils/errors/AppError');
const { emitPostsUpdated } = require('../realtime/events');

const normalizeSlug = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const mapPost = (postDoc) => {
  const post = postDoc.toObject ? postDoc.toObject() : postDoc;
  return post;
};

exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });

  sendSuccess(res, posts.map(mapPost), 'Lấy danh sách bài viết thành công');
});

exports.getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('ID bài viết không hợp lệ');
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new NotFoundError('Bài viết không tồn tại');
  }

  post.views += 1;
  await post.save();
  emitPostsUpdated({ action: 'viewed', post });

  sendSuccess(res, mapPost(post), 'Lấy chi tiết bài viết thành công');
});

exports.createPost = asyncHandler(async (req, res) => {
  const { title, slug, description, content, coverImage } = req.body;
  if (!title || !content) {
    throw new BadRequestError('Vui lòng nhập đầy đủ title và content');
  }

  const created = await Post.create({
    title,
    slug: normalizeSlug(slug || title),
    description: typeof description === 'string' ? description.trim() : '',
    content,
    coverImage: typeof coverImage === 'string' ? coverImage.trim() : '',
  });
  emitPostsUpdated({ action: 'created', post: created });

  sendSuccess(res, mapPost(created), 'Tạo bài viết thành công', HTTP_STATUS.CREATED);
});

exports.updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, slug, description, content, coverImage } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('ID bài viết không hợp lệ');
  }

  const post = await Post.findById(id);
  if (!post) throw new NotFoundError('Bài viết không tồn tại');

  if (title) post.title = title;
  if (slug != null || title != null) post.slug = normalizeSlug(slug || post.title);
  if (description != null) post.description = String(description).trim();
  if (content) post.content = content;
  if (coverImage != null) post.coverImage = String(coverImage).trim();
  await post.save();
  emitPostsUpdated({ action: 'updated', post });

  sendSuccess(res, mapPost(post), 'Cập nhật bài viết thành công');
});

exports.deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('ID bài viết không hợp lệ');
  }

  const post = await Post.findById(id);
  if (!post) throw new NotFoundError('Bài viết không tồn tại');
  const postId = String(post._id);
  await post.deleteOne();
  emitPostsUpdated({ action: 'deleted', postId });
  sendSuccess(res, null, 'Xóa bài viết thành công');
});

exports.reactPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('ID bài viết không hợp lệ');
  }

  if (!['like', 'dislike'].includes(type)) {
    throw new BadRequestError('type phải là like hoặc dislike');
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new NotFoundError('Bài viết không tồn tại');
  }

  if (type === 'like') {
    post.likes += 1;
  } else {
    post.dislikes += 1;
  }
  await post.save();
  emitPostsUpdated({ action: 'reacted', post });

  sendSuccess(res, mapPost(post), 'Tương tác bài viết thành công');
});
