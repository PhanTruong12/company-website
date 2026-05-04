import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getImagesByCollectionAndCategory } from '../data/collectionImages';
import { useDragScroll } from '../hooks/useDragScroll';
import './CollectionDetail.css';

const CollectionDetail = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [activeTab, setActiveTab] = useState('cau-thang');

  const {
    scrollContainerRef,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onKeyDown,
    tabIndex,
  } = useDragScroll({
    resetKey: `${collectionId ?? 'thach-anh'}-${activeTab}`,
  });

  // Map collection IDs to titles
  const collectionTitles: { [key: string]: string } = {
    'thach-anh': 'Bộ Sưu Tập Đá Thạch Anh',
    'nung-ket': 'Bộ Sưu Tập Đá Nung Kết',
    'tu-nhien': 'Bộ Sưu Tập Đá Tự Nhiên',
    'solid-surface': 'Bộ Sưu Tập Đá Solid Surface',
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
          <div className="collection-detail-gallery-container">
            <div
              ref={scrollContainerRef}
              className="collection-detail-gallery"
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onKeyDown={onKeyDown}
              tabIndex={tabIndex}
              aria-label={`${title} — ${tabs.find((t) => t.id === activeTab)?.label ?? ''}`}
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

