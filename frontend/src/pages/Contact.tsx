// Contact.tsx - Trang Liên hệ công ty
import { useState } from 'react';
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }, 1000);
  };

  const googleMapsAddress = "77 Võ Chí Công, Phường Hoà Xuân, Quận Cẩm Lệ, TP Đà Nẵng, Việt Nam";
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(googleMapsAddress)}&output=embed&zoom=15`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapsAddress)}`;

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* H1 - Tiêu đề chính */}
        <header className="contact-header">
          <h1 className="contact-h1">Liên hệ Công Ty TNHH TM & TK Tường Nhà Đẹp tại Đà Nẵng</h1>
        </header>

        {/* H2 - Thông tin liên hệ */}
        <section className="contact-section">
          <h2 className="contact-h2">Thông tin liên hệ cửa hàng vật liệu xây dựng tại Đà Nẵng</h2>
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-title">Địa chỉ cửa hàng</h3>
                <p className="contact-info-text">
                  77 Võ Chí Công, Phường Hoà Xuân, Quận Cẩm Lệ, TP Đà Nẵng, Việt Nam
                </p>
                <a 
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  Xem trên Google Maps →
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FaPhone />
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-title">Số điện thoại</h3>
                <p className="contact-info-text">
                  <a href="tel:0935789363" className="contact-phone-link">
                    093 578 93 63
                  </a>
                </p>
                <p className="contact-info-note">
                  Phục vụ khách hàng tại Đà Nẵng và khu vực lân cận
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FaEnvelope />
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-title">Email</h3>
                <p className="contact-info-text">
                  <a href="mailto:info@tndgranite.com" className="contact-link">
                    info@tndgranite.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* H2 - Kết nối nhanh */}
        <section className="contact-section">
          <h2 className="contact-h2">Kết nối nhanh – Tư vấn & báo giá</h2>
          
          <div className="cta-grid">
            {/* CTA Gọi điện */}
            <div className="cta-card cta-phone">
              <div className="cta-icon">
                <FaPhone />
              </div>
              <h3 className="cta-title">Gọi điện trực tiếp</h3>
              <p className="cta-description">
                Gọi ngay để được tư vấn và báo giá nhanh. Chúng tôi phản hồi ngay lập tức, 
                tư vấn rõ ràng và đề xuất giải pháp phù hợp nhất với nhu cầu của bạn.
              </p>
              <a href="tel:0935789363" className="cta-button cta-button-primary">
                <FaPhone /> Gọi ngay: 093 578 93 63
              </a>
            </div>

            {/* CTA Zalo */}
            <div className="cta-card cta-zalo">
              <div className="cta-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.64 6.12c.15.42.15.88.03 1.32l-.31 1.16c-.09.34-.2.67-.33.98l-.07.15c-.15.3-.33.57-.53.82l-.08.1c-.18.22-.38.42-.6.6l-.1.08c-.25.2-.52.38-.82.53l-.15.07c-.31.13-.64.24-.98.33l-1.16.31c-.44.12-.9.12-1.32-.03l-1.21-.4c-.13-.04-.26-.08-.38-.13l-.33-.13c-.3-.12-.58-.27-.84-.45l-.08-.06c-.24-.17-.46-.36-.65-.57l-.06-.07c-.2-.22-.38-.46-.54-.71l-.05-.08c-.16-.26-.3-.54-.42-.84l-.13-.33c-.05-.12-.09-.25-.13-.38l-.4-1.21c-.15-.42-.15-.88-.03-1.32l.31-1.16c.09-.34.2-.67.33-.98l.07-.15c.15-.3.33-.57.53-.82l.08-.1c.18-.22.38-.42.6-.6l.1-.08c.25-.2.52-.38.82-.53l.15-.07c.31-.13.64-.24.98-.33l1.16-.31c.44-.12.9-.12 1.32.03l1.21.4c.13.04.26.08.38.13l.33.13c.3.12.58.27.84.45l.08.06c.24.17.46.36.65.57l.06.07c.2.22.38.46.54.71l.05.08c.16.26.3.54.42.84l.13.33c.05.12.09.25.13.38l.4 1.21z"/>
                </svg>
              </div>
              <h3 className="cta-title">Chat Zalo</h3>
              <p className="cta-description">
                Chat Zalo để gửi hình ảnh, nhận tư vấn và báo giá chi tiết. 
                Tiện lợi cho khách hàng tại Đà Nẵng, dễ dàng chia sẻ hình ảnh công trình 
                và nhận phản hồi nhanh chóng từ đội ngũ tư vấn chuyên nghiệp.
              </p>
              <a 
                href="https://zalo.me/0935789363" 
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button cta-button-secondary"
              >
                Chat Zalo ngay
              </a>
            </div>

            {/* CTA Form */}
            <div className="cta-card cta-form">
              <div className="cta-icon">
                <FaEnvelope />
              </div>
              <h3 className="cta-title">Để lại thông tin</h3>
              <p className="cta-description">
                Để lại thông tin – chúng tôi sẽ liên hệ trong thời gian sớm nhất. 
                Phù hợp cho khách hàng cần khảo sát công trình và thi công đá ốp lát 
                tại Đà Nẵng và khu vực lân cận.
              </p>
            </div>
          </div>

          {/* Form liên hệ */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="093 578 93 63"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="your.email@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Nội dung tin nhắn <span className="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                rows={5}
                required
                placeholder="Mô tả nhu cầu của bạn hoặc đặt câu hỏi..."
              />
            </div>
            {submitStatus === 'success' && (
              <div className="form-success">
                Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="form-error">
                Có lỗi xảy ra. Vui lòng thử lại sau.
              </div>
            )}
            <button 
              type="submit" 
              className="form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </form>
        </section>

        {/* H2 - Vị trí cửa hàng */}
        <section className="contact-section">
          <h2 className="contact-h2">Vị trí cửa hàng Tường Nhà Đẹp tại Quận Cẩm Lệ – Đà Nẵng</h2>
          <div className="location-content">
            <p className="location-description">
              Cửa hàng vật liệu xây dựng Tường Nhà Đẹp tọa lạc tại số 77 Võ Chí Công, Phường Hoà Xuân, 
              Quận Cẩm Lệ, TP Đà Nẵng. Vị trí thuận tiện, dễ dàng tìm kiếm, phù hợp cho khách hàng 
              tại Đà Nẵng và các khu vực lân cận đến tham quan showroom và lựa chọn các sản phẩm đá granite, 
              đá marble, đá nung kết và đá thạch anh cao cấp.
            </p>
            <p className="location-description">
              Chúng tôi chuyên cung cấp và thi công đá ốp lát tại Đà Nẵng với đội ngũ nhân viên giàu kinh nghiệm, 
              sẵn sàng tư vấn và hỗ trợ khách hàng lựa chọn giải pháp phù hợp nhất cho công trình của mình.
            </p>
          </div>
          <div className="map-container">
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí cửa hàng Tường Nhà Đẹp tại Đà Nẵng"
            />
            <div className="map-actions">
              <a 
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link-button"
              >
                <FaMapMarkerAlt /> Mở trong Google Maps
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
