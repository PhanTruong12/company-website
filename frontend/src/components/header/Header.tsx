// Header.tsx - Component Header chính cho website showroom đá
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShowroomDropdown } from './ShowroomDropdown';
import { SearchBar } from './SearchBar';
import { Logo } from '../Logo';
import { FaPhone } from 'react-icons/fa';
import './Header.css';

/** State (menu mobile) reset khi đổi route nhờ key, tránh setState trong effect. */
const HeaderShell = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }
    // Khóa scroll body khi menu mobile mở để thao tác ổn định hơn.
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <Logo size="small" variant="light" showBackground={false} />
          <span className="logo-text">TND Granite</span>
        </Link>

        {/* Navigation */}
        <nav
          id="header-mobile-nav"
          className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}
          onClick={(event) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest('a')) setIsMobileMenuOpen(false);
          }}
        >
          <div className="mobile-nav-top">
            <SearchBar />
            <a href="tel:0935789363" className="mobile-nav-call">
              <FaPhone />
              <span>0935.789.363</span>
            </a>
          </div>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Trang Chủ
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            Giới Thiệu
          </Link>
          <ShowroomDropdown />
          <Link
            to="/contact"
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
          >
            Liên Hệ
          </Link>
          <Link
            to="/blog"
            className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
          >
            Blog
          </Link>
        </nav>

        {/* Right Section: Search + Phone */}
        <div className="header-right">
          <SearchBar />
          <a href="tel:0935789363" className="header-phone">
            <FaPhone />
            <span>0935.789.363</span>
          </a>
        </div>

        {/* Mobile Menu Toggle (sẽ implement sau) */}
        <button
          type="button"
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
          aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="header-mobile-nav"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <button
          type="button"
          className={`mobile-menu-backdrop ${isMobileMenuOpen ? 'is-open' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Đóng menu"
        />
      </div>
    </header>
  );
};

export const Header = () => {
  const location = useLocation();
  return <HeaderShell key={`${location.pathname}${location.search}`} />;
};

