import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllInteriorImages } from '../features/showroom/api';
import { getImageUrl } from '../utils/imageUrl';

const GALLERY_SRCSET_WIDTHS = [280, 360, 480, 640, 800] as const;

const buildGallerySrcSet = (imageUrl: string | undefined | null): string =>
  GALLERY_SRCSET_WIDTHS.map(
    (width) => `${getImageUrl(imageUrl, { width, crop: 'fill' })} ${width}w`
  ).join(', ');

const GallerySection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldLoadGallery, setShouldLoadGallery] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadGallery(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '700px 0px',
        threshold: 0,
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['home-gallery-images'],
    queryFn: () => fetchAllInteriorImages(undefined, undefined, undefined),
    staleTime: 5 * 60 * 1000,
    enabled: shouldLoadGallery,
  });

  const galleryItems = useMemo(() => data ?? [], [data]);
  const marqueeItems = useMemo(
    () => (galleryItems.length > 0 ? [...galleryItems, ...galleryItems] : []),
    [galleryItems]
  );

  if (shouldLoadGallery && !isLoading && !error && galleryItems.length === 0) return null;

  return (
    <section ref={sectionRef} className="gallery-section">
      <div className="gallery-heading-wrap">
        <div className="gallery-heading">
          <span className="gallery-eyebrow">Thư viện showroom</span>
          <h2>
            {!shouldLoadGallery || isLoading
              ? 'Đang tải thư viện đá'
              : '500+ Mẫu đá cho bạn lựa chọn'}
          </h2>
          <p>
            Các mẫu đá được cập nhật trực tiếp từ showroom, mang đến trải nghiệm chân thực về chất liệu, vân đá và ứng dụng thực tế trong từng khung hình liền mạch.
          </p>
        </div>
        <div className="gallery-specs" aria-label="Thông tin thư viện">
          <span>Ảnh thực tế</span>
          <span>Tự động cập nhật</span>
        </div>
      </div>

      {error ? (
        <div className="gallery-status">Không thể tải thư viện ảnh lúc này.</div>
      ) : (
        <div className="gallery-carousel-wrapper">
          <div className="gallery-carousel-container">
            <div className="gallery-carousel" aria-label="Băng chuyền ảnh mẫu đá">
              {!shouldLoadGallery || isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div className="gallery-card gallery-card--loading" key={index} />
                  ))
                : marqueeItems.map((item, index) => (
                    <div
                      className="gallery-card"
                      key={`${item._id}-${index}`}
                      aria-hidden={index >= galleryItems.length}
                    >
                      <img
                        src={getImageUrl(item.imageUrl, { width: 480, crop: 'fill' })}
                        srcSet={buildGallerySrcSet(item.imageUrl)}
                        sizes="(max-width: 640px) 76vw, (max-width: 1024px) 320px, 380px"
                        alt={item.name}
                        loading={index < 8 ? 'eager' : 'lazy'}
                        fetchPriority={index < 8 ? 'high' : 'low'}
                        decoding="async"
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
