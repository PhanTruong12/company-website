const mongoose = require('mongoose');

const normalizeSlug = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const createUniquePostSlug = async (Post, value, excludeId = null) => {
  const baseSlug = normalizeSlug(value) || 'bai-viet';
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existingPost = await Post.exists(query);
    if (!existingPost) return slug;
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

const findPostByIdOrSlug = async (Post, idOrSlug) => {
  const value = String(idOrSlug || '').trim();
  if (!value) return null;

  if (mongoose.Types.ObjectId.isValid(value)) {
    return Post.findById(value);
  }

  return Post.findOne({ slug: normalizeSlug(value) });
};

module.exports = {
  normalizeSlug,
  createUniquePostSlug,
  findPostByIdOrSlug,
};
