// InteriorImage.js - Model cho hình ảnh nội thất
const mongoose = require('mongoose');

const interiorImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên ảnh là bắt buộc'],
    trim: true
  },
  stoneType: {
    type: String,
    required: [true, 'Loại đá ốp tường là bắt buộc'],
    trim: true
  },
  wallPosition: {
    type: String,
    required: [true, 'Vị trí ốp trong nhà là bắt buộc'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Đường dẫn ảnh là bắt buộc']
  },
  cloudinaryPublicId: {
    type: String,
    default: null,
    sparse: true // Cho phép null và không bắt buộc unique nếu null
  }
}, {
  timestamps: true // Tự động tạo createdAt và updatedAt
});

// Indexes để tối ưu query
interiorImageSchema.index({ stoneType: 1 });
interiorImageSchema.index({ wallPosition: 1 });
interiorImageSchema.index({ stoneType: 1, wallPosition: 1 });

const InteriorImage = mongoose.model('InteriorImage', interiorImageSchema);

module.exports = InteriorImage;

