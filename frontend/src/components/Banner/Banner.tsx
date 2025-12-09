import './Banner.css';

const Banner = () => {
  return (
    <div className="banner-container">
      {/* Logo Section - Left */}
      <div className="logo-section">
        <div className="logo-block">
          <div className="logo-graphic">
            <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 40 L25 15 L35 25 L45 15 L55 40" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="logo-text">
            <h1 className="logo-title">TMD Granite</h1>
            <p className="logo-subtitle">INTERIOR - EXTERIOR</p>
          </div>
        </div>
      </div>

      {/* Company Info Section - Right */}
      <div className="company-info-section">
        <h2 className="company-name">Công Ty TNHH TM&TK Tường Nhà Đẹp</h2>
        <p className="company-services">Cung Cấp - Thi Công - Lắp Đặt</p>
        <p className="company-stones">Đá Granite-Đá Marble-Đá Nung Kết-Đá Thạch Anh</p>
        <button className="contact-button">0935.789.363</button>
      </div>
    </div>
  );
};

export default Banner;

