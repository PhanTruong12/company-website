import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../features/admin/lib/auth';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { getTrafficSummary } from '../../features/admin/api';
import { subscribeTrafficUpdated } from '../../utils/trafficSync';
import './AdminTraffic.css';

const AdminTraffic = () => {
  const queryClient = useQueryClient();
  const [days, setDays] = useState(7);
  const invalidateTimerRef = useRef<number | null>(null);

  const summaryQuery = useQuery({
    queryKey: ['admin-traffic', days],
    queryFn: () => getTrafficSummary(days),
  });

  useEffect(() => {
    const unsubscribe = subscribeTrafficUpdated(() => {
      if (invalidateTimerRef.current != null) return;
      invalidateTimerRef.current = window.setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['admin-traffic', days] });
        invalidateTimerRef.current = null;
      }, 1200);
    });

    return () => {
      unsubscribe();
      if (invalidateTimerRef.current != null) {
        window.clearTimeout(invalidateTimerRef.current);
      }
    };
  }, [days, queryClient]);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/internal/admin/login';
  };

  const summary = summaryQuery.data;
  const bestPage = summary?.topPages[0];
  const recentTrafficActivity =
    summary?.dailyStats
      .slice(-5)
      .reverse()
      .map((day) => ({
        title: `Ngày ${day.date}`,
        meta: `${day.views} views • ${day.clicks} clicks • ${day.uniqueVisitors} unique`,
      })) ?? [];

  return (
    <AdminDashboardLayout
      title="Dashboard Traffic Website"
      subtitle="Theo dõi lượt truy cập và hành vi click theo từng trang."
      activeTab="traffic"
      onLogout={handleLogout}
      actions={
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="admin-traffic-range"
        >
          <option value={7}>7 ngày</option>
          <option value={14}>14 ngày</option>
          <option value={30}>30 ngày</option>
          <option value={60}>60 ngày</option>
        </select>
      }
      stats={[
        { label: 'Tổng lượt xem', value: summary?.totals.totalViews ?? 0 },
        { label: 'Tổng lượt click', value: summary?.totals.totalClicks ?? 0 },
        { label: 'Unique visitors', value: summary?.totals.uniqueVisitors ?? 0 },
      ]}
      insights={[
        {
          title: 'CTR trung bình',
          value:
            summary && summary.totals.totalViews > 0
              ? `${Math.round((summary.totals.totalClicks / summary.totals.totalViews) * 100)}%`
              : '0%',
          tone: 'positive',
        },
        {
          title: 'Trang top views',
          value: bestPage?.path ?? 'N/A',
          tone: 'neutral',
        },
        {
          title: 'Views trang top',
          value: bestPage?.views ?? 0,
          tone: 'neutral',
        },
      ]}
      activityItems={recentTrafficActivity}
    >
      {summaryQuery.isLoading && <div className="admin-loading">Đang tải dữ liệu traffic...</div>}
      {summaryQuery.error && <div className="admin-error">Không thể tải dữ liệu traffic.</div>}

      {summary && (
        <div className="admin-traffic-grid">
          <section className="admin-traffic-card">
            <h3>Top trang được xem</h3>
            {summary.topPages.length === 0 ? (
              <p>Chưa có dữ liệu.</p>
            ) : (
              <ul className="admin-traffic-list">
                {summary.topPages.map((item) => (
                  <li key={item.path}>
                    <span className="path">{item.path}</span>
                    <span>{item.views} views</span>
                    <span>{item.clicks} clicks</span>
                    <span>{item.uniqueVisitors} unique</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="admin-traffic-card">
            <h3>Top click targets</h3>
            {summary.topClickTargets.length === 0 ? (
              <p>Chưa có dữ liệu.</p>
            ) : (
              <ul className="admin-traffic-list">
                {summary.topClickTargets.map((item) => (
                  <li key={item.target}>
                    <span className="path">{item.target}</span>
                    <span>{item.count} clicks</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="admin-traffic-card admin-traffic-card--full">
            <h3>Biến động theo ngày</h3>
            {summary.dailyStats.length === 0 ? (
              <p>Chưa có dữ liệu.</p>
            ) : (
              <table className="admin-traffic-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Views</th>
                    <th>Clicks</th>
                    <th>Unique</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.dailyStats.map((day) => (
                    <tr key={day.date}>
                      <td>{day.date}</td>
                      <td>{day.views}</td>
                      <td>{day.clicks}</td>
                      <td>{day.uniqueVisitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminTraffic;
