// CollectionDetail.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getImagesByCollectionAndCategory } from '../data/collectionImages';

// Import Swiper React components & modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

import './CollectionDetail.css';

const CollectionDetail = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [activeTab, setActiveTab] = useState('cau-thang');

  // Map collection IDs to titles
  const collectionTitles: { [key: string]: string } = {
    'thach-anh': 'Bộ Sưu Tập Đá Thạch Anh',
    'nung-ket': 'Bộ Sưu Tập Đá Nung Kết',
    'tu-nhien': 'Bộ Sưu Tập Đá Tự Nhiên',
    'solid-surface': 'Bộ Sưu Tập Solid Surface',
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
          <Swiper
            modules={[FreeMode, Mousewheel]}
            slidesPerView="auto" 
            freeMode={true}
            mousewheel={{ forceToAxis: true }}
            grabCursor={true}
            spaceBetween={20}
            breakpoints={{
              640: { spaceBetween: 24 },
              1024: { spaceBetween: 28 }
            }}
            className="collection-detail-swiper"
            aria-label={`${title} — ${tabs.find((t) => t.id === activeTab)?.label ?? ''}`}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={`${img}-${idx}`} className="collection-detail-card">
                <img src={img} alt={`${title} - ${activeTab} ${idx + 1}`} loading="lazy" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;