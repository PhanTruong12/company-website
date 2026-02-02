// AdminLogin.tsx - Trang đăng nhập Admin
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../features/admin/api';
import { authService } from '../../features/admin/lib/auth';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Nếu đã đăng nhập, redirect về trang quản lý
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/internal/admin/images';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      authService.login(result.token);
      console.log('Login success:', result);
      // Đăng nhập thành công, redirect về trang quản lý hoặc trang trước đó
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/internal/admin/images';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Đăng nhập thất bại';
      setError(errorMessage);
      // Log chi tiết để debug
      if (err instanceof Error && err.message.includes('Network')) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1 className="admin-login-title">Đăng Nhập Admin</h1>
        <p className="admin-login-subtitle">Hệ thống quản lý nội bộ</p>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required
              disabled={loading}
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

