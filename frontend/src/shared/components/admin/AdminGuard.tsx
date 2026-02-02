// shared/components/admin/AdminGuard.tsx - Admin route guard
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../../features/admin/lib/auth';
import { ROUTES } from '../../constants';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuth(authenticated);
      setIsChecking(false);
    };

    checkAuth();
  }, []);

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

  if (!isAuth) {
    return <Navigate to={ROUTES.ADMIN.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
