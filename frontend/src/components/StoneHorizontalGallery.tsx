import type { StoneCollectionItem } from '../data/stoneCollections';
import { useHorizontalScrollCarousel } from '../hooks/useHorizontalScrollCarousel';
import { StoneImageCard } from './StoneImageCard';

type StoneHorizontalGalleryProps = {
  items: StoneCollectionItem[];
  categoryName: string;
};

export const StoneHorizontalGallery = ({ items, categoryName }: StoneHorizontalGalleryProps) => {
  const { trackRef, scrollByDirection, handleArrowKeyScroll } = useHorizontalScrollCarousel({
    resetKey: categoryName,
    viewportRatio: 0.9,
    minStep: 320,
  });

  return (
    <div className="stone-horizontal-gallery">
      <div className="stone-horizontal-gallery-head">
        <h3 className="stone-horizontal-gallery-title">{categoryName}</h3>
        <div className="stone-horizontal-gallery-controls">
          <button
            type="button"
            className="stone-horizontal-gallery-control"
            onClick={() => scrollByDirection('prev')}
            aria-label={`Cuộn về trước: ${categoryName}`}
          >
            &#8249;
          </button>
          <button
            type="button"
            className="stone-horizontal-gallery-control"
            onClick={() => scrollByDirection('next')}
            aria-label={`Cuộn tiếp theo: ${categoryName}`}
          >
            &#8250;
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="stone-horizontal-gallery-track"
        tabIndex={0}
        onKeyDown={handleArrowKeyScroll}
        aria-label={`Gallery lướt ngang: ${categoryName}`}
      >
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="stone-horizontal-gallery-item">
              <StoneImageCard item={item} />
            </div>
          ))
        ) : (
          <div className="stone-horizontal-gallery-empty">Chưa có mẫu.</div>
        )}
      </div>
    </div>
  );
};

