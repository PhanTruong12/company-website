const TrafficAggregate = require('../../../models/TrafficAggregate');
const { sendSuccess } = require('../../../shared/utils/response');

const getDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - Math.max(days - 1, 0));
  return { start: getDateKey(start), end: getDateKey(end) };
};

exports.getTrafficSummary = async (req, res, next) => {
  try {
    const days = Number.parseInt(req.query.days, 10) || 7;
    const safeDays = Math.min(Math.max(days, 1), 90);
    const { start, end } = getDateRange(safeDays);

    const rows = await TrafficAggregate.find({ date: { $gte: start, $lte: end } }).lean();

    const totalViews = rows.reduce((sum, item) => sum + item.views, 0);
    const totalClicks = rows.reduce((sum, item) => sum + item.clicks, 0);
    const uniqueVisitors = rows.reduce((sum, item) => sum + item.uniqueVisitors, 0);

    const byPathMap = new Map();
    const byDayMap = new Map();
    const clickTargetMap = new Map();

    for (const row of rows) {
      const pathStat = byPathMap.get(row.path) || { path: row.path, views: 0, clicks: 0, uniqueVisitors: 0 };
      pathStat.views += row.views;
      pathStat.clicks += row.clicks;
      pathStat.uniqueVisitors += row.uniqueVisitors;
      byPathMap.set(row.path, pathStat);

      const dayStat = byDayMap.get(row.date) || { date: row.date, views: 0, clicks: 0, uniqueVisitors: 0 };
      dayStat.views += row.views;
      dayStat.clicks += row.clicks;
      dayStat.uniqueVisitors += row.uniqueVisitors;
      byDayMap.set(row.date, dayStat);

      for (const target of row.clickTargets || []) {
        clickTargetMap.set(target.target, (clickTargetMap.get(target.target) || 0) + target.count);
      }
    }

    const topPages = Array.from(byPathMap.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    const dailyStats = Array.from(byDayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    const topClickTargets = Array.from(clickTargetMap.entries())
      .map(([target, count]) => ({ target, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    sendSuccess(res, {
      range: { days: safeDays, start, end },
      totals: { totalViews, totalClicks, uniqueVisitors },
      topPages,
      dailyStats,
      topClickTargets,
    });
  } catch (error) {
    next(error);
  }
};
