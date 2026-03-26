// Showroom.tsx - Trang Showroom hiển thị gallery hình ảnh nội thất
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getInteriorImages,
  SHOWROOM_PAGE_SIZE,
} from '../features/showroom/api';
import type { ImagesUpdatedPayload, InteriorImage } from '../shared/types';
import { useStoneTypes } from '../hooks/useStoneTypes';
import { WALL_POSITIONS } from '../constants/wallPositions';
import { getImageUrl } from '../utils/imageUrl';
import { publicAsset } from '../utils/publicAsset';
import { subscribeImagesUpdated } from '../utils/imageSync';
import './Showroom.css';

/** Khớp bộ lọc showroom với logic filter API (stoneType + wallPosition OR) */
const matchesShowroomFilters = (
  img: InteriorImage,
  stoneType: string,
  wallPositions: string[]
): boolean => {
  if (stoneType && img.stoneType !== stoneType) return false;
  if (wallPositions.length === 0) return true;
  const imgWalls = Array.isArray(img.wallPosition)
    ? img.wallPosition
    : [String(img.wallPosition)];
  return wallPositions.some((w) => imgWalls.includes(w));
};

type ShowroomListMeta = {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
};

const Showroom = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState<InteriorImage[]>([]);
  const [listMeta, setListMeta] = useState<ShowroomListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<InteriorImage | null>(null);
  
  // Lấy danh sách loại đá từ API (đã cache bằng React Query)
  const { data: stoneTypesData = [], isLoading: isLoadingStoneTypes } = useStoneTypes();
  // Sử dụng trực tiếp data từ API (đã có name và slug từ backend)
  const stoneTypes = stoneTypesData;
  const wallPositions = WALL_POSITIONS;

  // Đọc filter từ URL params - khởi tạo với giá trị từ URL
  const [selectedStoneType, setSelectedStoneType] = useState<string>('');
  const [selectedWallPosition, setSelectedWallPosition] = useState<string[]>([]);
  
  // State cho sắp xếp: 'az' (A-Z), 'za' (Z-A), 'default' (mặc định)
  const [sortOrder, setSortOrder] = useState<'az' | 'za' | 'default'>('az');

  const fetchImagesPage = useCallback(
    async (
      stoneType: string | undefined,
      wallPosition: string[] | undefined,
      page: number,
      append: boolean
    ) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const { images: data, pagination } = await getInteriorImages(
          stoneType || undefined,
          wallPosition && wallPosition.length > 0 ? wallPosition : undefined,
          page,
          SHOWROOM_PAGE_SIZE
        );
        if (append) {
          setImages((prev) => [...prev, ...data]);
        } else {
          setImages(data);
        }
        setListMeta({
          total: pagination.total,
          page: pagination.page,
          totalPages: pagination.totalPages,
          limit: pagination.limit,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const loadFirstPage = useCallback(
    (stoneType?: string, wallPosition?: string[]) => {
      setImages([]);
      setListMeta(null);
      return fetchImagesPage(
        stoneType,
        wallPosition && wallPosition.length > 0 ? wallPosition : undefined,
        1,
        false
      );
    },
    [fetchImagesPage]
  );

  const loadMore = useCallback(() => {
    if (!listMeta || listMeta.page >= listMeta.totalPages) return;
    fetchImagesPage(
      selectedStoneType || undefined,
      selectedWallPosition.length > 0 ? selectedWallPosition : undefined,
      listMeta.page + 1,
      true
    );
  }, [fetchImagesPage, listMeta, selectedStoneType, selectedWallPosition]);

  // Đọc filter từ URL khi component mount hoặc URL thay đổi
  // Đợi stoneTypes load xong rồi mới match và set state
  useEffect(() => {
    const stoneTypeFromUrl = searchParams.get('stoneType') || '';
    const decodeQueryValue = (value: string) =>
      decodeURIComponent(value.replace(/\+/g, ' '));

    const rawWallPosition = searchParams.get('wallPosition') || '';
    const wallPositionFromUrl = rawWallPosition
      ? decodeQueryValue(rawWallPosition)
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
      : [];
    
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
    
    // Load trang đầu (12 ảnh) với giá trị đã được xử lý
    loadFirstPage(finalStoneType, wallPositionFromUrl);
  }, [searchParams, stoneTypes, loadFirstPage]);

  // Load lại images khi user thay đổi filter từ dropdown (không phải từ URL)
  // useEffect này chỉ chạy khi selectedStoneType hoặc selectedWallPosition thay đổi từ user interaction
  // Không chạy khi đã được set từ URL (vì đã load trong useEffect trên)

  const handleStoneTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStoneType(value);
    
    // Reset về 12 ảnh đầu khi đổi filter
    loadFirstPage(value, selectedWallPosition);
    
    // Cập nhật URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('stoneType', value);
    } else {
      newParams.delete('stoneType');
    }
    setSearchParams(newParams, { replace: true });
  };

  const syncWallPositions = (next: string[]) => {
    loadFirstPage(selectedStoneType, next);
    const newParams = new URLSearchParams(searchParams);
    if (next.length > 0) {
      newParams.set('wallPosition', next.join(','));
    } else {
      newParams.delete('wallPosition');
    }
    setSearchParams(newParams, { replace: true });
  };

  const toggleWallPosition = (position: string) => {
    setSelectedWallPosition((prev) => {
      const next = prev.includes(position)
        ? prev.filter((item) => item !== position)
        : [...prev, position];
      syncWallPositions(next);
      return next;
    });
  };

  // Lắng nghe CRUD ảnh realtime (socket + tab): merge payload, không refetch khi có đủ dữ liệu
  useEffect(() => {
    const unsubscribe = subscribeImagesUpdated((payload: ImagesUpdatedPayload) => {
      if (payload.action === 'sync') {
        loadFirstPage(selectedStoneType, selectedWallPosition);
        return;
      }

      if (payload.action === 'deleted') {
        const id = payload.imageId;
        setImages((prev) => prev.filter((i) => i._id !== id));
        setSelectedImage((cur) => (cur && cur._id === id ? null : cur));
        setListMeta((prev) =>
          prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev
        );
        return;
      }

      const img = payload.image;
      if (payload.action === 'created') {
        if (!matchesShowroomFilters(img, selectedStoneType, selectedWallPosition)) {
          return;
        }
        setImages((prev) => {
          if (prev.some((i) => i._id === img._id)) return prev;
          return [img, ...prev];
        });
        setListMeta((prev) =>
          prev ? { ...prev, total: prev.total + 1 } : prev
        );
        return;
      }

      if (payload.action === 'updated') {
        setImages((prev) => {
          const matches = matchesShowroomFilters(
            img,
            selectedStoneType,
            selectedWallPosition
          );
          const idx = prev.findIndex((i) => i._id === img._id);
          if (idx === -1) {
            if (!matches) return prev;
            return [img, ...prev];
          }
          if (!matches) {
            return prev.filter((i) => i._id !== img._id);
          }
          const next = [...prev];
          next[idx] = img;
          return next;
        });
      }
    });
    return unsubscribe;
  }, [loadFirstPage, selectedStoneType, selectedWallPosition]);

  // Giữ modal chi tiết khớp bản ghi trong danh sách sau khi merge realtime
  useEffect(() => {
    if (!selectedImage?._id) return;
    const updated = images.find((i) => i._id === selectedImage._id);
    if (!updated) setSelectedImage(null);
    else setSelectedImage(updated);
  }, [images, selectedImage?._id]);

  const clearFilters = () => {
    setSelectedStoneType('');
    setSelectedWallPosition([]);
    
    loadFirstPage('', []);
    
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
  const filteredWallPositions = sortedWallPositions;

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const modalCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selectedImage) return;
    modalCloseRef.current?.focus();
  }, [selectedImage]);

  useEffect(() => {
    if (!selectedImage) return;

    const idx = sortedImages.findIndex((i) => i._id === selectedImage._id);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
        return;
      }
      if (event.key === 'ArrowLeft' && idx > 0) {
        event.preventDefault();
        setSelectedImage(sortedImages[idx - 1]);
        return;
      }
      if (event.key === 'ArrowRight' && idx >= 0 && idx < sortedImages.length - 1) {
        event.preventDefault();
        setSelectedImage(sortedImages[idx + 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, sortedImages]);

  const goModalPrev = () => {
    if (!selectedImage) return;
    const idx = sortedImages.findIndex((i) => i._id === selectedImage._id);
    if (idx > 0) setSelectedImage(sortedImages[idx - 1]);
  };

  const goModalNext = () => {
    if (!selectedImage) return;
    const idx = sortedImages.findIndex((i) => i._id === selectedImage._id);
    if (idx >= 0 && idx < sortedImages.length - 1) {
      setSelectedImage(sortedImages[idx + 1]);
    }
  };

  const removeStoneTypeFilter = () => {
    setSelectedStoneType('');
    loadFirstPage('', selectedWallPosition);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('stoneType');
    setSearchParams(newParams, { replace: true });
  };

  const removeWallFilter = (position: string) => {
    const next = selectedWallPosition.filter((p) => p !== position);
    setSelectedWallPosition(next);
    syncWallPositions(next);
  };

  const hasActiveFilters = !!selectedStoneType || selectedWallPosition.length > 0;

  const hasMore =
    listMeta !== null &&
    listMeta.totalPages > 0 &&
    listMeta.page < listMeta.totalPages;

  const modalImageIndex =
    selectedImage != null
      ? sortedImages.findIndex((i) => i._id === selectedImage._id)
      : -1;

  return (
    <div className="showroom">
      <div className="showroom-container">
        {/* Filter bar - phong cách card nhẹ */}
        <div className="showroom-filters">
          <div className="filter-card">
            <div className="filter-row-main">
              <div className="filter-field">
                <label htmlFor="stoneType">Loại đá</label>
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
              <div className="filter-field">
                <label htmlFor="sortOrder">Sắp xếp</label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as 'az' | 'za' | 'default')
                  }
                >
                  <option value="az">A - Z</option>
                  <option value="za">Z - A</option>
                  <option value="default">Mặc định</option>
                </select>
              </div>
              <div className="filter-row-positions">
                <div className="filter-positions-head">
                  <span className="filter-positions-label">Vị trí sử dụng</span>
                  <span className="filter-positions-count">
                    Đã chọn {selectedWallPosition.length} vị trí
                  </span>
                </div>
                <div className="filter-chips-wrap">
                  <div
                    className="filter-chips-scroll"
                    role="group"
                    aria-label="Chọn vị trí ốp"
                  >
                    <button
                      type="button"
                      className={`filter-chip ${selectedWallPosition.length === 0 ? 'is-selected' : ''}`}
                      onClick={() => {
                        if (selectedWallPosition.length === 0) return;
                        setSelectedWallPosition([]);
                        syncWallPositions([]);
                      }}
                      aria-pressed={selectedWallPosition.length === 0}
                    >
                      Tất cả
                    </button>
                    {filteredWallPositions.map((position) => {
                      const selected = selectedWallPosition.includes(position);
                      return (
                        <button
                          key={position}
                          type="button"
                          className={`filter-chip ${selected ? 'is-selected' : ''}`}
                          onClick={() => toggleWallPosition(position)}
                          aria-pressed={selected}
                        >
                          {position}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="filter-reset"
                  onClick={clearFilters}
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
            {hasActiveFilters && (
              <div
                className="filter-active-bar"
                aria-label="Bộ lọc đang áp dụng"
              >
                <span className="filter-active-title">Đang lọc</span>
                <div className="filter-active-chips">
                  {selectedStoneType && (
                    <button
                      type="button"
                      className="filter-active-chip"
                      onClick={removeStoneTypeFilter}
                      aria-label={`Bỏ lọc loại đá ${selectedStoneType}`}
                    >
                      <span className="filter-active-chip-label">Loại đá</span>
                      <span className="filter-active-chip-value">{selectedStoneType}</span>
                      <span className="filter-active-chip-remove" aria-hidden>
                        ×
                      </span>
                    </button>
                  )}
                  {selectedWallPosition.map((position) => (
                    <button
                      key={position}
                      type="button"
                      className="filter-active-chip"
                      onClick={() => removeWallFilter(position)}
                      aria-label={`Bỏ lọc vị trí ${position}`}
                    >
                      <span className="filter-active-chip-label">Vị trí</span>
                      <span className="filter-active-chip-value">{position}</span>
                      <span className="filter-active-chip-remove" aria-hidden>
                        ×
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toast lỗi */}
        {error && (
          <div className="showroom-toast" role="alert" aria-live="assertive">
            <p className="showroom-toast-text">{error}</p>
            <div className="showroom-toast-actions">
              <button
                type="button"
                className="showroom-toast-retry"
                onClick={() =>
                  loadFirstPage(selectedStoneType, selectedWallPosition)
                }
              >
                Thử lại
              </button>
              <button
                type="button"
                className="showroom-toast-dismiss"
                onClick={() => setError(null)}
                aria-label="Đóng thông báo"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Skeleton khi tải trang đầu */}
        {loading && images.length === 0 && (
          <div
            className="showroom-skeleton-grid"
            aria-busy="true"
            aria-label="Đang tải thư viện ảnh"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="gallery-skeleton-card">
                <div className="gallery-skeleton-shimmer" />
                <div className="gallery-skeleton-line gallery-skeleton-line--wide" />
                <div className="gallery-skeleton-line gallery-skeleton-line--narrow" />
              </div>
            ))}
          </div>
        )}

        {/* Gallery */}
        {!loading && !error && (
          <>
            {images.length === 0 ? (
              <div className="showroom-empty">
                <div className="showroom-empty-icon" aria-hidden>
                  <svg viewBox="0 0 64 64" width="56" height="56" fill="none">
                    <rect x="8" y="14" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
                    <circle cx="24" cy="28" r="6" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 42l14-12 10 10 12-10 12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="showroom-empty-title">Không có ảnh phù hợp</p>
                <p className="showroom-empty-hint">
                  {selectedStoneType || selectedWallPosition.length > 0
                    ? 'Thử đổi loại đá hoặc vị trí ốp, hoặc xem toàn bộ thư viện.'
                    : 'Hiện chưa có ảnh nào trong thư viện. Vui lòng quay lại sau.'}
                </p>
                {(selectedStoneType || selectedWallPosition.length > 0) && (
                  <button type="button" onClick={clearFilters} className="btn-clear-filters">
                    Xem tất cả hình ảnh
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="showroom-count">
                  Hiển thị {sortedImages.length} /{' '}
                  {listMeta?.total ?? sortedImages.length} ảnh
                </div>
                <div className="showroom-gallery">
                  {sortedImages.map((image) => (
                    <button
                      key={image._id}
                      type="button"
                      className="gallery-item"
                      onClick={() => setSelectedImage(image)}
                      aria-label={`Xem chi tiết ${image.name}`}
                    >
                      <div className="gallery-image-wrapper">
                        <img
                          src={getImageUrl(image.imageUrl, { width: 600, crop: 'fill' })}
                          alt={image.name}
                          className="gallery-image"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = publicAsset('placeholder.jpg');
                          }}
                        />
                        <div className="gallery-overlay">
                          <div className="gallery-info">
                            <h3 className="gallery-title">{image.name}</h3>
                            <p className="gallery-meta">
                              <span className="gallery-tag">{image.stoneType}</span>
                              <span className="gallery-tag">
                                {Array.isArray(image.wallPosition)
                                  ? image.wallPosition.join(', ')
                                  : image.wallPosition}
                              </span>
                            </p>
                            {image.description && (
                              <p className="gallery-description">{image.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {hasMore && (
                  <div className="showroom-load-more-wrap">
                    <button
                      type="button"
                      className="showroom-load-more"
                      onClick={loadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
        {selectedImage && (
          <div
            className="image-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Xem ảnh ${selectedImage.name}`}
            onClick={closeImageModal}
          >
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              {sortedImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="image-modal-nav image-modal-nav--prev"
                    onClick={goModalPrev}
                    disabled={modalImageIndex <= 0}
                    aria-label="Ảnh trước"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="image-modal-nav image-modal-nav--next"
                    onClick={goModalNext}
                    disabled={modalImageIndex < 0 || modalImageIndex >= sortedImages.length - 1}
                    aria-label="Ảnh sau"
                  >
                    ›
                  </button>
                </>
              )}
              <button
                ref={modalCloseRef}
                type="button"
                className="image-modal-close"
                onClick={closeImageModal}
                aria-label="Đóng"
              >
                ×
              </button>
              <img
                src={getImageUrl(selectedImage.imageUrl)}
                alt={selectedImage.name}
                className="image-modal-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = publicAsset('placeholder.jpg');
                }}
              />
              <div className="image-modal-info">
                <h3 className="image-modal-title">{selectedImage.name}</h3>
                <div className="image-modal-meta">
                  <span className="image-modal-tag">{selectedImage.stoneType}</span>
                  <span className="image-modal-tag">
                    {Array.isArray(selectedImage.wallPosition)
                      ? selectedImage.wallPosition.join(', ')
                      : selectedImage.wallPosition}
                  </span>
                </div>
                {selectedImage.description && (
                  <p className="image-modal-description">{selectedImage.description}</p>
                )}
                {sortedImages.length > 1 && (
                  <p className="image-modal-hint">
                    Mũi tên trái/phải để xem ảnh khác · Esc để đóng
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Showroom;

