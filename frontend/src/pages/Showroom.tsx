// Showroom.tsx - Trang Showroom hiển thị gallery hình ảnh nội thất
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getInteriorImages,
  type InteriorImage,
} from '../services/interiorImage.service';
import { useStoneTypes } from '../hooks/useStoneTypes';
import { WALL_POSITIONS } from '../constants/wallPositions';
import { getImageUrl } from '../utils/imageUrl';
import './Showroom.css';

const Showroom = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState<InteriorImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lấy danh sách loại đá từ API (đã cache bằng React Query)
  const { data: stoneTypesData = [], isLoading: isLoadingStoneTypes } = useStoneTypes();
  // Sử dụng trực tiếp data từ API (đã có name và slug từ backend)
  const stoneTypes = stoneTypesData;
  const wallPositions = WALL_POSITIONS;

  // Đọc filter từ URL params - khởi tạo với giá trị từ URL
  const [selectedStoneType, setSelectedStoneType] = useState<string>('');
  const [selectedWallPosition, setSelectedWallPosition] = useState<string>('');
  
  // State cho sắp xếp: 'az' (A-Z), 'za' (Z-A), 'default' (mặc định)
  const [sortOrder, setSortOrder] = useState<'az' | 'za' | 'default'>('az');

  const loadImages = useCallback(async (stoneType?: string, wallPosition?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInteriorImages(
        stoneType || undefined,
        wallPosition || undefined
      );
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, []);

  // Đọc filter từ URL khi component mount hoặc URL thay đổi
  // Đợi stoneTypes load xong rồi mới match và set state
  useEffect(() => {
    const stoneTypeFromUrl = searchParams.get('stoneType') || '';
    const wallPositionFromUrl = searchParams.get('wallPosition') || '';
    
    // Decode URL parameter (trong trường hợp có ký tự đặc biệt)
    const decodedStoneType = stoneTypeFromUrl ? decodeURIComponent(stoneTypeFromUrl) : '';
    
    let finalStoneType = '';
    
    // Tìm tên loại đá khớp trong danh sách (case-insensitive, có thể có biến thể)
    if (decodedStoneType) {
      if (stoneTypes.length > 0) {
        // Normalize để so sánh (loại bỏ "Đá" prefix và khoảng trắng thừa)
        const normalize = (str: string) => str.toLowerCase().trim().replace(/^đá\s+/, '');
        const normalizedUrl = normalize(decodedStoneType);
        
        const matchedStoneType = stoneTypes.find((type) => {
          const normalizedType = normalize(type.name);
          return (
            normalizedType === normalizedUrl ||
            normalizedType.includes(normalizedUrl) ||
            normalizedUrl.includes(normalizedType)
          );
        });
        
        if (matchedStoneType) {
          // Sử dụng tên chính xác từ API để đảm bảo filter hoạt động đúng
          finalStoneType = matchedStoneType.name;
        } else {
          // Nếu không tìm thấy khớp, thử dùng giá trị từ URL (có thể backend sẽ xử lý)
          finalStoneType = decodedStoneType;
        }
      } else {
        // Nếu stoneTypes chưa load xong, dùng giá trị từ URL tạm thời
        finalStoneType = decodedStoneType;
      }
    }
    
    // Set state và load images ngay lập tức
    setSelectedStoneType(finalStoneType);
    setSelectedWallPosition(wallPositionFromUrl);
    
    // Load images với giá trị đã được xử lý
    loadImages(finalStoneType, wallPositionFromUrl);
  }, [searchParams, stoneTypes, loadImages]);

  // Load lại images khi user thay đổi filter từ dropdown (không phải từ URL)
  // useEffect này chỉ chạy khi selectedStoneType hoặc selectedWallPosition thay đổi từ user interaction
  // Không chạy khi đã được set từ URL (vì đã load trong useEffect trên)

  const handleStoneTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStoneType(value);
    
    // Load images ngay khi user thay đổi
    loadImages(value, selectedWallPosition);
    
    // Cập nhật URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('stoneType', value);
    } else {
      newParams.delete('stoneType');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleWallPositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedWallPosition(value);
    
    // Load images ngay khi user thay đổi
    loadImages(selectedStoneType, value);
    
    // Cập nhật URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('wallPosition', value);
    } else {
      newParams.delete('wallPosition');
    }
    setSearchParams(newParams, { replace: true });
  };

  const clearFilters = () => {
    setSelectedStoneType('');
    setSelectedWallPosition('');
    
    // Load images với filter rỗng
    loadImages('', '');
    
    // Xóa tất cả params khỏi URL
    setSearchParams({}, { replace: true });
  };

  // Hàm sắp xếp ảnh theo bảng chữ cái
  const sortImages = (imagesToSort: InteriorImage[]): InteriorImage[] => {
    if (sortOrder === 'default') {
      return imagesToSort;
    }

    const sorted = [...imagesToSort].sort((a, b) => {
      // Sử dụng localeCompare với locale 'vi' để sắp xếp đúng tiếng Việt
      const comparison = a.name.localeCompare(b.name, 'vi', {
        sensitivity: 'base',
        numeric: true,
      });
      
      return sortOrder === 'az' ? comparison : -comparison;
    });

    return sorted;
  };

  // Lấy danh sách ảnh đã được sắp xếp
  const sortedImages = sortImages(images);

  // Sắp xếp stoneTypes và wallPositions theo bảng chữ cái cho filter dropdowns
  const sortedStoneTypes = [...stoneTypes].sort((a, b) => 
    a.name.localeCompare(b.name, 'vi', { sensitivity: 'base', numeric: true })
  );
  
  const sortedWallPositions = [...wallPositions].sort((a, b) => 
    a.localeCompare(b, 'vi', { sensitivity: 'base', numeric: true })
  );

  return (
    <div className="showroom">
      <div className="showroom-container">
        <div className="showroom-header">
          <h1 className="showroom-title">Showroom</h1>
          <p className="showroom-subtitle">
            Khám phá bộ sưu tập hình ảnh nội thất với đá cao cấp
          </p>
        </div>

        {/* Filters */}
        <div className="showroom-filters">
          <div className="filter-group">
            <label htmlFor="stoneType">Lọc theo loại đá:</label>
            <select
              id="stoneType"
              value={selectedStoneType}
              onChange={handleStoneTypeChange}
            >
              <option value="">Tất cả</option>
              {isLoadingStoneTypes ? (
                <option disabled>Đang tải...</option>
              ) : (
                sortedStoneTypes.map((type) => (
                  <option key={type.name} value={type.name}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="wallPosition">Lọc theo vị trí:</label>
            <select
              id="wallPosition"
              value={selectedWallPosition}
              onChange={handleWallPositionChange}
            >
              <option value="">Tất cả</option>
              {sortedWallPositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortOrder">Sắp xếp:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'az' | 'za' | 'default')}
            >
              <option value="az">A - Z</option>
              <option value="za">Z - A</option>
              <option value="default">Mặc định</option>
            </select>
          </div>

          {(selectedStoneType || selectedWallPosition) && (
            <button className="btn-clear-filters" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="showroom-loading">Đang tải hình ảnh...</div>
        )}

        {error && (
          <div className="showroom-error">
            <p>Lỗi: {error}</p>
            <button onClick={() => loadImages(selectedStoneType, selectedWallPosition)} className="btn-retry">
              Thử lại
            </button>
          </div>
        )}

        {/* Gallery */}
        {!loading && !error && (
          <>
            {images.length === 0 ? (
              <div className="showroom-empty">
                <p>Không tìm thấy hình ảnh nào với bộ lọc hiện tại.</p>
                {(selectedStoneType || selectedWallPosition) && (
                  <button onClick={clearFilters} className="btn-clear-filters">
                    Xem tất cả hình ảnh
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="showroom-count">
                  Hiển thị {sortedImages.length} hình ảnh
                </div>
                <div className="showroom-gallery">
                  {sortedImages.map((image) => (
                    <div key={image._id} className="gallery-item">
                  <div className="gallery-image-wrapper">
                <img
                          src={getImageUrl(image.imageUrl)}
                          alt={image.name}
                          className="gallery-image"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.jpg';
                          }}
                        />
                        <div className="gallery-overlay">
                          <div className="gallery-info">
                            <h3 className="gallery-title">{image.name}</h3>
                            <p className="gallery-meta">
                              <span className="gallery-tag">{image.stoneType}</span>
                              <span className="gallery-tag">{image.wallPosition}</span>
                            </p>
                            {image.description && (
                              <p className="gallery-description">{image.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Showroom;

