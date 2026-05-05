import { useEffect, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import type { StoneCollectionItem } from '../data/stoneCollections';
import { buildCloudinarySrcSetFromWidths, getImageUrl } from '../utils/imageUrl';

type Stone3DCarouselProps = {
  items: StoneCollectionItem[];
  categoryName: string;
  showroomHref: string;
};

const DESKTOP_GRID_MIN_PX = 1024;

/** Độ rộng gợi ý cho Cloudinary srcset — giữ cố định để CDN cache hiệu quả. */
const COLLECTION_SRCSET_WIDTHS = [280, 360, 480, 640, 800, 1080] as const;

/**
 * Desktop: ô grid ~25vw (4 cột) hoặc ~33vw (3 cột). Mobile: slide ~88vw.
 */
const COLLECTION_IMAGE_SIZES =
  '(min-width: 1024px) min(340px, 26vw), min(88vw, 520px)';

function subscribeDesktopMq(onStoreChange: () => void) {
  const mq = window.matchMedia(`(min-width: ${DESKTOP_GRID_MIN_PX}px)`);
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getDesktopMqSnapshot() {
  return window.matchMedia(`(min-width: ${DESKTOP_GRID_MIN_PX}px)`).matches;
}

/** SSR / snapshot hydration: mặc định mobile (strip) để khớp layout hẹp. */
function getDesktopMqServerSnapshot() {
  return false;
}

function useIsDesktopGridLayout() {
  return useSyncExternalStore(subscribeDesktopMq, getDesktopMqSnapshot, getDesktopMqServerSnapshot);
}

function StoneCollectionImage({
  item,
  loading,
  variant = 'card',
}: {
  item: StoneCollectionItem;
  loading: 'eager' | 'lazy';
  variant?: 'card' | 'fullscreen';
}) {
  const targetWidth = variant === 'fullscreen' ? 1200 : 640;
  const targetHeight = Math.max(1, Math.round((targetWidth * item.height) / item.width));
  const src = getImageUrl(item.imageUrl, {
    width: targetWidth,
    height: targetHeight,
    crop: 'fill',
  });

  const srcSet = buildCloudinarySrcSetFromWidths(
    item.imageUrl,
    COLLECTION_SRCSET_WIDTHS,
    (w) => Math.max(1, Math.round((w * item.height) / item.width))
  );

  return (
    <img
      src={src}
      {...(srcSet ? { srcSet, sizes: COLLECTION_IMAGE_SIZES } : {})}
      alt={item.alt}
      loading={loading}
      decoding="async"
      width={item.width}
      height={item.height}
      className="stone-collection-img"
    />
  );
}

export const Stone3DCarousel = ({ items, categoryName, showroomHref }: Stone3DCarouselProps) => {
  const isDesktopGrid = useIsDesktopGridLayout();
  const [activeDesktopIndex, setActiveDesktopIndex] = useState(0);
  const [fullscreenItem, setFullscreenItem] = useState<StoneCollectionItem | null>(null);

  useEffect(() => {
    setActiveDesktopIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (isDesktopGrid) {
      setFullscreenItem(null);
    }
  }, [isDesktopGrid]);

  useEffect(() => {
    if (!isDesktopGrid || items.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveDesktopIndex((index) => (index + 1) % items.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isDesktopGrid, items.length]);

  useEffect(() => {
    if (!fullscreenItem) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFullscreenItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenItem]);

  if (items.length === 0) {
    return (
      <div className="stone-collection-category">
        <div className="stone-collection-category-head">
          <h3 className="stone-collection-category-title">{categoryName}</h3>
        </div>
        <div className="stone-collection-empty">Chưa có mẫu.</div>
      </div>
    );
  }

  return (
    <div className="stone-collection-category">
      <div className="stone-collection-category-head">
        <h3 className="stone-collection-category-title">{categoryName}</h3>
      </div>

      {isDesktopGrid ? (
        <div
          className={`stone-gallery-desktop-carousel${items.length === 1 ? ' is-single' : ''}`}
          role="region"
          aria-roledescription="carousel"
          aria-label={`Lưới ảnh ${categoryName}`}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`stone-gallery-desktop-slide${
                index === activeDesktopIndex ? ' is-active' : ''
              }`}
            >
              <div className="stone-collection-media">
                <StoneCollectionImage item={item} loading={index === 0 ? 'eager' : 'lazy'} />
              </div>
            </div>
          ))}
          <div className="stone-gallery-desktop-meta">
            <span className="stone-gallery-desktop-name">{categoryName}</span>
            <Link
              to={showroomHref}
              className="stone-gallery-desktop-count"
              aria-label={`xem thêm ${categoryName} trong showroom`}
            >
              xem thêm
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="stone-gallery-strip"
          role="region"
          aria-roledescription="carousel"
          aria-label={`Ảnh mẫu ${categoryName} — vuốt ngang để xem`}
        >
          <ul className="stone-gallery-strip-track">
            {items.map((item, index) => (
              <li key={item.id} className="stone-gallery-strip-slide">
                <button
                  type="button"
                  className="stone-gallery-fullscreen-trigger"
                  onClick={() => setFullscreenItem(item)}
                  aria-label={`Xem toàn màn hình ${item.title}`}
                >
                  <StoneCollectionImage item={item} loading={index === 0 ? 'eager' : 'lazy'} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {fullscreenItem ? (
        <div
          className="stone-gallery-fullscreen"
          role="dialog"
          aria-modal="true"
          aria-label={`Ảnh toàn màn hình ${fullscreenItem.title}`}
          onClick={() => setFullscreenItem(null)}
        >
          <button
            type="button"
            className="stone-gallery-fullscreen-close"
            onClick={() => setFullscreenItem(null)}
            aria-label="Đóng ảnh toàn màn hình"
          >
            ×
          </button>
          <figure className="stone-gallery-fullscreen-figure" onClick={(event) => event.stopPropagation()}>
            <img
              src={getImageUrl(fullscreenItem.imageUrl, {
                width: 1200,
                height: 900,
                crop: 'fit',
              })}
              alt={fullscreenItem.alt}
              className="stone-gallery-fullscreen-img"
              decoding="async"
            />
            <figcaption className="stone-gallery-fullscreen-caption">
              {fullscreenItem.title}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
};
