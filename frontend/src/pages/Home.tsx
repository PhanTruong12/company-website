import { FaFacebook } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Marble texture background overlay */}
      <div className="home-background"></div>
      
      <div className="home-content">
        {/* Main Content Section */}
        <div className="main-container">
          <div className="main-content">
            {/* Company Information */}
            <div className="info-section">
              <div className="info-content">
                {/* Company Name */}
                <div>
                  <h2 className="company-name">
                    TND Granite
                  </h2>
                </div>
                
                {/* Services */}
                <div>
                  <p className="services">
                    Cung Cấp - Thi Công - Lắp Đặt
                  </p>
                </div>
                
                {/* Stone Types */}
                <div>
                  <div className="stone-types" aria-label="Các dòng đá chính">
                    <div className="stone-types-row">
                      <span>Đá Granite</span>
                      <span>Đá Marble</span>
                    </div>
                    <div className="stone-types-row">
                      <span>Đá Nung Kết</span>
                      <span>Đá Thạch Anh</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Facebook Icon - Bottom Right */}
        <div className="facebook-float">
          <a 
            href="https://www.facebook.com/thicongdatunhien"
            target="_blank"
            rel="noopener noreferrer"
            className="facebook-float-link"
            aria-label="Facebook"
          >
            <FaFacebook size={26} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
