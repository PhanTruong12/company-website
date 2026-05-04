import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { StoneCollectionItem } from '../data/stoneCollections';
import { getImageUrl } from '../utils/imageUrl';

type Stone3DCarouselProps = {
  items: StoneCollectionItem[];
  categoryName: string;
};

const SWIPE_THRESHOLD = 50;

const clampIndex = (next: number, max: number) => {
  if (max <= 0) return 0;
  if (next < 0) return 0;
  if (next > max) return max;
  return next;
};

export const Stone3DCarousel = ({ items, categoryName }: Stone3DCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeStartX = useRef<number | null>(null);

  const maxIndex = Math.max(0, items.length - 1);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => clampIndex(prev - 1, maxIndex));
  }, [maxIndex]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => clampIndex(prev + 1, maxIndex));
  }, [maxIndex]);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (items.length <= 1) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('button')) return;

    swipeStartX.current = event.clientX;

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Một số môi trường không hỗ trợ capture; vuốt vẫn hoạt động bình thường
    }
  }, [items.length]);

  const commitSwipe = useCallback(
    (clientX: number) => {
      if (items.length <= 1) return;
      if (swipeStartX.current == null) return;

      const dx = clientX - swipeStartX.current;
      swipeStartX.current = null;

      if (Math.abs(dx) < SWIPE_THRESHOLD) return;

      if (dx < 0) {
        goNext();
        return;
      }

      goPrev();
    },
    [goNext, goPrev, items.length]
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      commitSwipe(event.clientX);
    },
    [commitSwipe]
  );

  const handlePointerCancel = useCallback((event: PointerEvent<HTMLDivElement>) => {
    swipeStartX.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* noop */
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (items.length <= 1) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      }
    },
    [goNext, goPrev, items.length]
  );

  return (
    <div className="stone-3d-carousel">
      <div className="stone-3d-carousel-head">
        <h3 className="stone-3d-carousel-title">{categoryName}</h3>
      </div>

      <div
        className="stone-3d-carousel-stage"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        tabIndex={0}
        aria-label={`Carousel bộ sưu tập ${categoryName}`}
      >
        {items.length > 0 ? (
          <>
            <div
              className="stone-3d-carousel-track"
              style={{
                width: `${items.length * 100}%`,
                transform: `translateX(-${(activeIndex * 100) / items.length}%)`,
                transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="stone-3d-carousel-slide"
                  style={{ flex: `0 0 ${100 / items.length}%` }}
                >
                  <img
                    src={getImageUrl(item.imageUrl, { width: item.width, height: item.height, crop: 'fill' })}
                    alt={item.alt}
                    draggable={false}
                    loading={index === activeIndex ? 'eager' : 'lazy'}
                    width={item.width}
                    height={item.height}
                  />
                </div>
              ))}
            </div>

            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  className="stone-3d-carousel-control stone-3d-carousel-control--prev"
                  onClick={goPrev}
                  aria-label={`Xem mẫu trước của ${categoryName}`}
                >
                  &#8249;
                </button>
                <button
                  type="button"
                  className="stone-3d-carousel-control stone-3d-carousel-control--next"
                  onClick={goNext}
                  aria-label={`Xem mẫu tiếp theo của ${categoryName}`}
                >
                  &#8250;
                </button>
              </>
            ) : null}
          </>
        ) : (
          <div className="stone-3d-carousel-empty">Chưa có mẫu.</div>
        )}

        {items.length > 1 ? (
          <div className="stone-3d-carousel-dots" aria-label={`Vị trí ảnh trong ${categoryName}`}>
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`stone-3d-carousel-dot ${index === activeIndex ? 'is-active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Chuyển đến mẫu ${index + 1} của ${categoryName}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

