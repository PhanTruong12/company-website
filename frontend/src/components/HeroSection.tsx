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
          <div className="info-block">
            <div className="info-content">
              <h1 className="company-name">
                Công Ty TNHH TM&TK Tường Nhà Đẹp
              </h1>
              
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
