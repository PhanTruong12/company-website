// AdminGuard.tsx - Component bảo vệ các route admin
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { authService } from '../../features/admin/lib/auth';

interface AdminGuardProps {
  children: ReactNode;
}

/**
 * AdminGuard - Component bảo vệ các route admin
 * Nếu chưa đăng nhập, redirect về trang login
 */
export const AdminGuard = ({ children }: AdminGuardProps) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Kiểm tra authentication
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuth(authenticated);
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  // Đang kiểm tra
  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  // Chưa đăng nhập, redirect về login
  if (!isAuth) {
    return <Navigate to="/internal/admin/login" state={{ from: location }} replace />;
  }

  // Đã đăng nhập, cho phép truy cập
  return <>{children}</>;
};

