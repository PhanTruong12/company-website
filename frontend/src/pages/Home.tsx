import { FaFacebook, FaPhone } from 'react-icons/fa';
import { Logo } from '../components/Logo';
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
            {/* Logo Block */}
            <div className="logo-section">
              <Logo 
                size="xlarge" 
                variant="dark" 
                showBackground={true}
                className="home-logo"
              />
            </div>

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
                  <p className="stone-types">
                    Đá Granite-Đá Marble-Đá Nung Kết-Đá Thạch Anh
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Phone button standalone */}
        <div className="call-center">
          <a 
            href="tel:0935789363"
            className="phone-button phone-button-small"
          >
            0935.789.363
          </a>
        </div>

        {/* Phone Icon - Floating on right edge */}
        <div className="phone-float">
          <a 
            href="tel:0935789363"
            className="phone-float-link"
            aria-label="Call us"
          >
            <FaPhone size={26} />
          </a>
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
