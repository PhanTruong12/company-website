// Product.js - Model cho sản phẩm (kết hợp loại đá và kiểu nội thất)
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stoneType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoneType',
    required: true
  },
  interiorType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InteriorType',
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    enum: ['m²', 'm', 'viên', 'bộ'],
    default: 'm²'
  },
  specifications: {
    thickness: String,
    size: String,
    color: String,
    finish: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ stoneType: 1, interiorType: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

