// InteriorType.js - Model cho kiểu nội thất
const mongoose = require('mongoose');

const interiorTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Bếp', 'Cầu Thang', 'Nền Tường-Nhà'],
    trim: true
  },
  nameEn: {
    type: String,
    enum: ['Kitchen', 'Stairs', 'Floor-Wall-Home'],
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
interiorTypeSchema.index({ name: 1 });

const InteriorType = mongoose.model('InteriorType', interiorTypeSchema);

module.exports = InteriorType;

