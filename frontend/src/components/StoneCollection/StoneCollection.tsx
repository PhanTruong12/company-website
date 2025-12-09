import React from 'react';
import './StoneCollection.css';

const StoneCollection = () => {
  return (
    <div className="stone-collection-wrapper">
      {/* Header Section */}
      <div className="stone-collection-header">
        <h2 className="section-title">Bộ Sưu Tập Đá</h2>
        <div className="title-divider"></div>
      </div>

      {/* Placeholder Section */}
      <div className="placeholder-section">
        <div className="placeholder-overlay">
          <span className="placeholder-text">60px</span>
        </div>
        <button className="placeholder-dropdown">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6 L8 10 L12 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Main Content Section */}
      <div className="stone-collection-content">
        <div className="content-container">
          {/* Image Section - Left */}
          <div className="image-section">
            <div className="image-placeholder">
              <div className="image-content">
                <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none">
                  {/* Staircase representation */}
                  <rect x="50" y="50" width="300" height="200" fill="#f0f0f0" rx="8"/>
                  <rect x="60" y="60" width="280" height="15" fill="#e0e0e0" rx="2"/>
                  <rect x="60" y="85" width="280" height="15" fill="#e0e0e0" rx="2"/>
                  <rect x="60" y="110" width="280" height="15" fill="#e0e0e0" rx="2"/>
                  <rect x="60" y="135" width="280" height="15" fill="#e0e0e0" rx="2"/>
                  <rect x="60" y="160" width="280" height="15" fill="#e0e0e0" rx="2"/>
                  <line x1="300" y1="50" x2="300" y2="250" stroke="#d0d0d0" strokeWidth="2"/>
                  <text x="200" y="160" textAnchor="middle" fill="#999" fontSize="14" fontFamily="Arial">
                    Hình ảnh cầu thang đá
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Text Section - Right */}
          <div className="text-section">
            <h3 className="collection-title">Bộ Sưu Tập Đá Thạch Anh</h3>
            <p className="collection-description">
              Bộ sưu tập đá thạch anh mang đến vẻ đẹp hiện đại, sang trọng và tinh tế, tạo điểm nhấn độc đáo cho không gian nội thất của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoneCollection;

