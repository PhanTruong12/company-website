import './FloatingActionButtons.css';

const FloatingActionButtons = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:0935789363';
  };

  const handleFacebookClick = () => {
    window.open('https://facebook.com', '_blank');
  };

  return (
    <div className="fab-container">
      <button 
        className="fab fab-phone" 
        onClick={handlePhoneClick}
        aria-label="Gọi điện"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
        </svg>
      </button>
      
      <button 
        className="fab fab-facebook" 
        onClick={handleFacebookClick}
        aria-label="Facebook"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor"/>
        </svg>
      </button>
      
      <button 
        className="fab fab-scroll-top" 
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
};

export default FloatingActionButtons;

