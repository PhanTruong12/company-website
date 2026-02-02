// Logo.tsx - Component Logo TND Granite
import './Logo.css';
import { publicAsset } from '../utils/publicAsset';

interface LogoProps {
  /**
   * Kích thước logo
   * - 'small': Dùng cho Header (50px)
   * - 'medium': Dùng cho các section nhỏ (100px)
   * - 'large': Dùng cho Hero/Homepage (200px+)
   * - 'xlarge': Dùng cho Hero lớn (300px+)
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * Variant của logo
   * - 'light': Logo trên nền sáng
   * - 'dark': Logo trên nền tối (có background box)
   */
  variant?: 'light' | 'dark';
  /**
   * Có hiển thị background box không (chỉ áp dụng khi variant='dark')
   */
  showBackground?: boolean;
  /**
   * Class name tùy chỉnh
   */
  className?: string;
}

export const Logo = ({
  size = 'large',
  variant = 'dark',
  showBackground = true,
  className = '',
}: LogoProps) => {
  const logoClasses = [
    'tnd-logo',
    `tnd-logo--${size}`,
    `tnd-logo--${variant}`,
    showBackground && variant === 'dark' ? 'tnd-logo--with-bg' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={logoClasses}>
      <div className="tnd-logo-container">
        <img
          src={publicAsset('logo.jpg')}
          alt="TND Granite Logo"
          className="tnd-logo-image"
          loading="lazy"
        />
      </div>
    </div>
  );
};

