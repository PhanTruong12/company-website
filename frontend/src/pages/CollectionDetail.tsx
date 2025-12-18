import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getImagesByCollectionAndCategory } from '../data/collectionImages';
import './CollectionDetail.css';

const CollectionDetail = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [activeTab, setActiveTab] = useState('cau-thang');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Map collection IDs to titles
  const collectionTitles: { [key: string]: string } = {
    'thach-anh': 'Bộ Sưu Tập Đá Thạch Anh',
    'nung-ket': 'Bộ Sưu Tập Đá Nung Kết',
    'tu-nhien': 'Bộ Sưu Tập Đá Tự Nhiên',
  };

  const title = collectionTitles[collectionId || 'thach-anh'] || 'Bộ Sưu Tập Đá';

  const tabs = [
    { id: 'cau-thang', label: 'Cầu Thang' },
    { id: 'bep', label: 'Bếp' },
  ];

  // Lấy hình ảnh theo collection và category
  const images = getImagesByCollectionAndCategory(
    collectionId || 'thach-anh',
    activeTab
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(carouselRef.current.scrollLeft);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
      carouselRef.current.style.scrollSnapType = 'none';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
      carouselRef.current.style.scrollSnapType = 'x mandatory';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  }, [activeTab]);

  return (
    <div className="collection-detail-page">
      <div className="collection-detail-header">
        <h1 className="collection-detail-title">{title}</h1>
        <div className="collection-detail-line" />
      </div>

      <div className="collection-detail-content">
        <div className="collection-detail-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`collection-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="collection-detail-gallery-wrapper">
          <div className="collection-detail-gallery-container">
            <div
              ref={carouselRef}
              className="collection-detail-gallery"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {images.map((img, idx) => (
                <div className="collection-detail-card" key={`${img}-${idx}`}>
                  <img src={img} alt={`${title} - ${activeTab} ${idx + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;

