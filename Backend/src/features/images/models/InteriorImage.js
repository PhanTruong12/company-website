// features/images/models/InteriorImage.js - Interior Image Model
const mongoose = require('mongoose');

const interiorImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên ảnh là bắt buộc'],
    trim: true
  },
  stoneType: {
    type: [String],
    required: [true, 'Loại đá ốp tường là bắt buộc'],
    default: [],
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: 'Loại đá ốp tường là bắt buộc'
    }
  },
  stoneType_norm: {
    type: [String],
    default: []
  },
  be_mat: {
    type: [String],
    default: []
  },
  be_mat_norm: {
    type: [String],
    default: []
  },
  // Fallback for backward compatibility with legacy data.
  hang_muc: {
    type: String,
    default: null,
    trim: true
  },
  // Legacy field from previous version; keep temporary for safe rollout.
  category: {
    type: String,
    default: null,
    trim: true
  },
  wallPosition: {
    type: [String],
    required: [true, 'Vị trí ốp trong nhà là bắt buộc'],
    default: [],
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: 'Vị trí ốp trong nhà là bắt buộc'
    }
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
interiorImageSchema.index({ stoneType_norm: 1 });
interiorImageSchema.index({ be_mat: 1 });
interiorImageSchema.index({ be_mat_norm: 1 });
interiorImageSchema.index({ wallPosition: 1 });

const InteriorImage = mongoose.model('InteriorImage', interiorImageSchema);

module.exports = InteriorImage;
