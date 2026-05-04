import type { StoneCollectionItem } from '../data/stoneCollections';
import { useHorizontalScrollCarousel } from '../hooks/useHorizontalScrollCarousel';
import { StoneImageCard } from './StoneImageCard';

type StoneImageCarouselProps = {
  items: StoneCollectionItem[];
  categoryName: string;
};

export const StoneImageCarousel = ({ items, categoryName }: StoneImageCarouselProps) => {
  const { trackRef, scrollByDirection, handleArrowKeyScroll } = useHorizontalScrollCarousel({
    resetKey: categoryName,
    viewportRatio: 0.82,
    minStep: 280,
  });

  return (
    <div className="stone-carousel">
      <div className="stone-carousel-header">
        <h3 className="stone-carousel-title">{categoryName}</h3>

        <div className="stone-carousel-controls">
          <button
            type="button"
            className="stone-carousel-control"
            onClick={() => scrollByDirection('prev')}
            aria-label={`Xem ảnh trước của ${categoryName}`}
          >
            &#8249;
          </button>
          <button
            type="button"
            className="stone-carousel-control"
            onClick={() => scrollByDirection('next')}
            aria-label={`Xem ảnh tiếp theo của ${categoryName}`}
          >
            &#8250;
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="stone-carousel-track"
        tabIndex={0}
        onKeyDown={handleArrowKeyScroll}
        aria-label={`Băng chuyền ảnh cho ${categoryName}`}
      >
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="stone-carousel-slide">
              <StoneImageCard item={item} />
            </div>
          ))
        ) : (
          <div className="stone-carousel-empty">Chưa có mẫu.</div>
        )}
      </div>
    </div>
  );
};

