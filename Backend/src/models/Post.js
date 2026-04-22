const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề là bắt buộc'],
      trim: true,
      maxlength: [200, 'Tiêu đề tối đa 200 ký tự'],
    },
    slug: {
      type: String,
      default: '',
      trim: true,
      maxlength: [220, 'Slug tối đa 220 ký tự'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Mô tả tối đa 500 ký tự'],
    },
    content: {
      type: String,
      required: [true, 'Nội dung là bắt buộc'],
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'URL ảnh tiêu đề quá dài'],
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
