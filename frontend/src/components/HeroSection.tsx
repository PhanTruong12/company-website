import { FaFacebook, FaPhone } from 'react-icons/fa';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Marble texture background overlay */}
      <div className="hero-background"></div>
      
      {/* Main Container */}
      <div className="hero-container">
        {/* Main Content Block - Flexbox */}
        <div className="hero-content">
          {/* Logo Block (Left) - 1/3 width, fixed height ~400px */}
          <div className="logo-block">
            <div className="logo-box">
              {/* Mountain Icon SVG */}
              <div className="logo-icon">
                <svg width="105" height="53" viewBox="0 0 140 70">
                  <path d="M25 50 L45 25 L65 50 Z" fill="white" stroke="white" strokeWidth="1" />
                  <path d="M65 50 L85 25 L105 50 Z" fill="white" stroke="white" strokeWidth="1" />
                </svg>
              </div>
              
              {/* TMĐ Granite Text */}
              <h1 className="logo-title">
                <span>TM</span>
                <span>Đ</span>
                <br />
                <span className="logo-subtitle">Granite</span>
              </h1>
              
              {/* INTERIOR - EXTERIOR */}
              <p className="logo-tagline">
                INTERIOR - EXTERIOR
              </p>
            </div>
          </div>

          {/* Info Block (Right) - 2/3 width */}
          <div className="info-block">
            <div className="info-content">
              {/* Company Name - Large, bold, left-aligned */}
              <h2 className="company-name">
                Công Ty TNHH TM&TK Tường Nhà Đẹp
              </h2>
              
              {/* Services Text - Smaller, italic */}
              <p className="services-text">
                Cung Cấp - Thi Công - Lắp Đặt
              </p>
              
              {/* Stone Types - Smaller, italic */}
              <p className="stone-types">
                Đá Granite-Đá Marble-Đá Nung Kết-Đá Thạch Anh
              </p>
              
              {/* Contact Button - Black, centered below text */}
              <div>
                <a 
                  href="tel:0935789363"
                  className="phone-button"
                >
                  0935.789.363
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section - Full width with beige background */}
        <div className="footer-section">
          <div className="footer-box">
            {/* Horizontal Separator */}
            <div className="footer-separator"></div>
            
            {/* Footer Text - Centered, bold */}
            <h3 className="footer-title">
              Bộ Sưu Tập Đá
            </h3>
          </div>
        </div>
      </div>

      {/* Floating Icons - Fixed Position on right edge */}
      {/* Phone Icon - Middle right, dark green */}
      <div className="phone-icon-container">
        <a 
          href="tel:0935789363"
          className="phone-icon"
          aria-label="Call us"
        >
          <FaPhone size={24} />
        </a>
      </div>
      
      {/* Facebook Icon - Bottom right, blue */}
      <div className="facebook-icon-container">
        <a 
          href="https://www.facebook.com/thicongdatunhien"
          target="_blank"
          rel="noopener noreferrer"
          className="facebook-icon"
          aria-label="Facebook"
        >
          <FaFacebook size={24} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
