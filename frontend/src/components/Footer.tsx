// Footer.tsx - Component Footer cho website
import { Link } from 'react-router-dom';
import { FaPhone, FaFacebook, FaMapMarkerAlt } from 'react-icons/fa';
import { Logo } from './Logo';
import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Company Info */}
          <div className="footer-column">
            <div className="footer-logo-section">
              <Logo size="medium" variant="dark" showBackground={false} />
              <h3 className="footer-company-name">TND Granite</h3>
            </div>
            <p className="footer-company-full">
              Công Ty TNHH TM&TK Tường Nhà Đẹp
            </p>
            <p className="footer-services">
              Cung Cấp - Thi Công - Lắp Đặt
            </p>
            <p className="footer-stone-types">
              Đá Granite • Đá Marble • Đá Nung Kết • Đá Thạch Anh
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="footer-title">Liên Kết Nhanh</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Trang Chủ</Link>
              </li>
              <li>
                <Link to="/about">Giới Thiệu</Link>
              </li>
              <li>
                <Link to="/services">Dịch Vụ</Link>
              </li>
              <li>
                <Link to="/showroom">Showroom</Link>
              </li>
              <li>
                <Link to="/contact">Liên Hệ</Link>
              </li>
            </ul>
          </div>

          {/* Showroom Links */}
          <div className="footer-column">
            <h4 className="footer-title">Bộ Sưu Tập</h4>
            <ul className="footer-links">
              <li>
                <Link to="/showroom?stoneType=Thạch Anh">Đá Thạch Anh</Link>
              </li>
              <li>
                <Link to="/showroom?stoneType=Nung Kết">Đá Nung Kết</Link>
              </li>
              <li>
                <Link to="/showroom?stoneType=Tự Nhiên">Đá Tự Nhiên</Link>
              </li>
              <li>
                <Link to="/showroom">Xem Tất Cả</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column footer-column-contact">
            <h4 className="footer-title">Liên Hệ</h4>
            <ul className="footer-contact">
              <li>
                <a href="tel:0935789363" className="footer-contact-item">
                  <FaPhone className="footer-icon" />
                  <span>0935.789.363</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/thicongdatunhien" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-item"
                >
                  <FaFacebook className="footer-icon" />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=77+Võ+Chí+Công,+Hòa+Xuân,+Cẩm+Lệ,+Đà+Nẵng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-item"
                >
                  <FaMapMarkerAlt className="footer-icon" />
                  <span>77 Võ Chí Công, Hòa Xuân, Cẩm Lệ, Đà Nẵng</span>
                </a>
              </li>
            </ul>
            
            {/* Map - Compact */}
            <div className="footer-map-container">
              <iframe
                src={`https://www.google.com/maps?q=77+Võ+Chí+Công,+Hòa+Xuân,+Cẩm+Lệ,+Đà+Nẵng&output=embed&zoom=15`}
                width="100%"
                height="180"
                style={{ border: 0, borderRadius: '6px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vị trí TND Granite"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} TND Granite. Tất cả quyền được bảo lưu.
            </p>
            <p className="footer-designed">
              Thiết kế bởi TND Granite
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

