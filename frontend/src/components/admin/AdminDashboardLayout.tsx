import { Link } from 'react-router-dom';
import './AdminDashboardLayout.css';

interface DashboardStat {
  label: string;
  value: string | number;
  hint?: string;
}

interface DashboardInsight {
  title: string;
  value: string | number;
  tone?: 'neutral' | 'positive' | 'warning';
}

interface DashboardActivityItem {
  title: string;
  meta: string;
}

interface AdminDashboardLayoutProps {
  title: string;
  subtitle: string;
  activeTab: 'images' | 'blogs' | 'traffic';
  stats?: DashboardStat[];
  insights?: DashboardInsight[];
  activityItems?: DashboardActivityItem[];
  showUtilitySection?: boolean;
  actions?: React.ReactNode;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminDashboardLayout = ({
  title,
  subtitle,
  activeTab,
  stats = [],
  insights = [],
  activityItems = [],
  showUtilitySection = true,
  actions,
  onLogout,
  children,
}: AdminDashboardLayoutProps) => {
  const now = new Date().toLocaleString('vi-VN');

  return (
    <div className="admin-dashboard">
      <aside className="admin-dashboard-sidebar">
        <div className="admin-dashboard-brand">
          <p className="admin-dashboard-kicker">Admin Panel</p>
          <h2>TND Granite</h2>
        </div>

        <nav className="admin-dashboard-nav">
          <Link
            to="/internal/admin/images"
            className={`admin-dashboard-nav-item ${activeTab === 'images' ? 'active' : ''}`}
          >
            Quản Lý Ảnh Đá
          </Link>
          <Link
            to="/internal/admin/blogs"
            className={`admin-dashboard-nav-item ${activeTab === 'blogs' ? 'active' : ''}`}
          >
            Quản Lý Blog
          </Link>
          <Link
            to="/internal/admin/traffic"
            className={`admin-dashboard-nav-item ${activeTab === 'traffic' ? 'active' : ''}`}
          >
            Thống Kê Traffic
          </Link>
        </nav>

        <button className="admin-dashboard-logout" onClick={onLogout}>
          Đăng Xuất
        </button>
      </aside>

      <main className="admin-dashboard-main">
        <section className="admin-dashboard-topbar">
          <span className="admin-dashboard-topbar-dot" />
          <span>Hệ thống hoạt động bình thường</span>
          <span className="admin-dashboard-topbar-time">{now}</span>
        </section>

        <header className="admin-dashboard-header">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="admin-dashboard-header-actions">{actions}</div>
        </header>

        {stats.length > 0 && (
          <section className="admin-dashboard-stats">
            {stats.map((item) => (
              <article key={item.label} className="admin-dashboard-stat-card">
                <p className="admin-dashboard-stat-label">{item.label}</p>
                <p className="admin-dashboard-stat-value">{item.value}</p>
                {item.hint ? <p className="admin-dashboard-stat-hint">{item.hint}</p> : null}
              </article>
            ))}
          </section>
        )}

        {showUtilitySection && (
          <section className="admin-dashboard-utility">
            <article className="admin-dashboard-utility-card">
              <h3>Quick Actions</h3>
              <div className="admin-dashboard-quick-actions">
                <Link to="/internal/admin/images">Mở quản lý ảnh</Link>
                <Link to="/internal/admin/blogs">Mở quản lý blog</Link>
                <Link to="/internal/admin/traffic">Mở thống kê traffic</Link>
                <Link to="/blog" target="_blank" rel="noreferrer">
                  Xem blog public
                </Link>
              </div>
            </article>

            <article className="admin-dashboard-utility-card">
              <h3>Insights</h3>
              {insights.length === 0 ? (
                <p className="admin-dashboard-empty-text">Chưa có insight.</p>
              ) : (
                <div className="admin-dashboard-insights">
                  {insights.map((item) => (
                    <div key={item.title} className={`insight-chip ${item.tone ?? 'neutral'}`}>
                      <span>{item.title}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="admin-dashboard-utility-card">
              <h3>Recent Activity</h3>
              {activityItems.length === 0 ? (
                <p className="admin-dashboard-empty-text">Chưa có hoạt động gần đây.</p>
              ) : (
                <ul className="admin-dashboard-activity">
                  {activityItems.slice(0, 5).map((item) => (
                    <li key={`${item.title}-${item.meta}`}>
                      <p>{item.title}</p>
                      <small>{item.meta}</small>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        )}

        <section className="admin-dashboard-content">{children}</section>
      </main>
    </div>
  );
};
