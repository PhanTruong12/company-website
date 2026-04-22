const mongoose = require('mongoose');

const trafficVisitorDailySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, index: true },
    path: { type: String, required: true, index: true, maxlength: 180 },
    visitorHash: { type: String, required: true, maxlength: 64, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

trafficVisitorDailySchema.index({ date: 1, path: 1, visitorHash: 1 }, { unique: true });

module.exports = mongoose.model('TrafficVisitorDaily', trafficVisitorDailySchema);
