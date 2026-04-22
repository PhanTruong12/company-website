const mongoose = require('mongoose');

const clickTargetSchema = new mongoose.Schema(
  {
    target: { type: String, required: true, trim: true, maxlength: 120 },
    count: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const trafficAggregateSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    path: { type: String, required: true, index: true, maxlength: 180 },
    views: { type: Number, default: 0, min: 0 },
    clicks: { type: Number, default: 0, min: 0 },
    uniqueVisitors: { type: Number, default: 0, min: 0 },
    clickTargets: { type: [clickTargetSchema], default: [] },
    lastEventAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

trafficAggregateSchema.index({ date: 1, path: 1 }, { unique: true });

module.exports = mongoose.model('TrafficAggregate', trafficAggregateSchema);
