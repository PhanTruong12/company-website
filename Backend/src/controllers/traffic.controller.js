const crypto = require('crypto');
const TrafficAggregate = require('../models/TrafficAggregate');
const TrafficVisitorDaily = require('../models/TrafficVisitorDaily');
const { sendSuccess } = require('../utils/response');
const { BadRequestError } = require('../utils/errors/AppError');
const { emitTrafficUpdated } = require('../realtime/events');

const MAX_PATH_LENGTH = 180;
const MAX_TARGET_LENGTH = 120;

const getDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const sanitizePath = (value) => {
  const path = typeof value === 'string' ? value.trim() : '';
  if (!path) return '/';
  return path.slice(0, MAX_PATH_LENGTH);
};

const sanitizeTarget = (value) => {
  const target = typeof value === 'string' ? value.trim() : '';
  return target.slice(0, MAX_TARGET_LENGTH);
};

const getVisitorHash = (req) => {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.ip || 'unknown';
  const ua = req.get('user-agent') || 'unknown';
  const lang = req.get('accept-language') || 'unknown';
  return crypto.createHash('sha256').update(`${ip}|${ua}|${lang}`).digest('hex');
};

const incrementClickTarget = (doc, target) => {
  if (!target) return;
  const existing = doc.clickTargets.find((item) => item.target === target);
  if (existing) {
    existing.count += 1;
  } else {
    doc.clickTargets.push({ target, count: 1 });
  }
  doc.clickTargets.sort((a, b) => b.count - a.count);
  if (doc.clickTargets.length > 15) {
    doc.clickTargets = doc.clickTargets.slice(0, 15);
  }
};

exports.trackEvent = async (req, res, next) => {
  try {
    const type = req.body?.type;
    if (type !== 'pageview' && type !== 'click') {
      throw new BadRequestError('type phải là pageview hoặc click');
    }

    const dateKey = getDateKey();
    const path = sanitizePath(req.body?.path);
    const target = sanitizeTarget(req.body?.target);
    const visitorHash = getVisitorHash(req);

    const aggregate = await TrafficAggregate.findOneAndUpdate(
      { date: dateKey, path },
      { $setOnInsert: { date: dateKey, path }, $set: { lastEventAt: new Date() } },
      { upsert: true, new: true }
    );

    if (type === 'pageview') {
      aggregate.views += 1;
      const ttlDate = new Date();
      ttlDate.setDate(ttlDate.getDate() + 45);
      const visitorResult = await TrafficVisitorDaily.updateOne(
        { date: dateKey, path, visitorHash },
        { $setOnInsert: { date: dateKey, path, visitorHash, expiresAt: ttlDate } },
        { upsert: true }
      );
      if (visitorResult.upsertedCount > 0) {
        aggregate.uniqueVisitors += 1;
      }
    } else {
      aggregate.clicks += 1;
      incrementClickTarget(aggregate, target);
    }

    await aggregate.save();
    emitTrafficUpdated({ type, path, date: dateKey });
    sendSuccess(res, { ok: true }, 'Track thành công');
  } catch (error) {
    next(error);
  }
};
