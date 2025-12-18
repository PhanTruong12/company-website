// Header.tsx - Component Header chính cho website showroom đá
import { Link, useLocation } from 'react-router-dom';
import { ShowroomDropdown } from './ShowroomDropdown';
import { SearchBar } from './SearchBar';
import { Logo } from '../Logo';
import { FaPhone } from 'react-icons/fa';
import './Header.css';

export const Header = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <Logo size="small" variant="light" showBackground={false} />
          <span className="logo-text">TND Granite</span>
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
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
        <button className="mobile-menu-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

