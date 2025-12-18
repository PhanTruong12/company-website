// StoneType.js - Model cho loại đá
const mongoose = require('mongoose');

const stoneTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Thạch Anh', 'Nung Kết', 'Tự Nhiên'],
    trim: true
  },
  slug: {
    type: String,
    required: false,
    trim: true
  },
  nameEn: {
    type: String,
    enum: ['Quartz', 'Sintered Stone', 'Natural Stone'],
    required: false
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index
stoneTypeSchema.index({ name: 1 });

const StoneType = mongoose.model('StoneType', stoneTypeSchema);

module.exports = StoneType;

