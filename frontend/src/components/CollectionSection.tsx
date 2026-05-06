import { useMemo, type CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllInteriorImages } from '../features/showroom/api';
import type { InteriorImage } from '../shared/types';
import { orderCarouselCategoryItems, stoneCollectionCategories } from '../data/stoneCollections';
import { HomeSectionCTA } from './HomeSectionCTA';
import { Stone3DCarousel } from './Stone3DCarousel';
import './CollectionSection.css';

const normalizeText = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi');

const getImageStoneTypes = (img: InteriorImage): string[] => {
  const source = img.stoneType;
  const raw = Array.isArray(source) ? source : typeof source === 'string' ? source.split(',') : [];
  return raw.map((item) => String(item).trim()).filter(Boolean);
};

const getImageWallPositions = (img: InteriorImage): string[] => {
  const source = img.wallPosition;
  const raw = Array.isArray(source) ? source : [String(source)];
  return raw.map((item) => String(item).trim()).filter(Boolean);
};

const buildShowroomFilterHref = (stoneTypeFilters: string[], wallPositionFilters: string[]) => {
  const params = new URLSearchParams();
  const primaryStoneType = stoneTypeFilters.find((value) => value.trim().length > 0);

  if (primaryStoneType) {
    params.set('stoneType', primaryStoneType);
  }

  const wallPositions = wallPositionFilters.map((value) => value.trim()).filter(Boolean);
  if (wallPositions.length > 0) {
    params.set('wallPosition', wallPositions.join(','));
  }

  const query = params.toString();
  return query ? `/showroom?${query}` : '/showroom';
};

export const StoneCollectionSection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['home-stone-collection-images'],
    queryFn: () => fetchAllInteriorImages(undefined, undefined, undefined),
    staleTime: 5 * 60 * 1000,
  });

  const categoriesWithItems = useMemo(() => {
    const images = data ?? [];

    return stoneCollectionCategories.map((category) => {
      const rawItems = images
        .filter((image) => {
          const imageStoneTypes = getImageStoneTypes(image).map(normalizeText);
          const imageWallPositions = getImageWallPositions(image).map(normalizeText);
          const categoryStoneTypes = category.stoneTypeFilters.map(normalizeText);
          const categoryWallPositions = category.wallPositionFilters.map(normalizeText);

          const matchesStoneType = categoryStoneTypes.some((stoneType) =>
            imageStoneTypes.some((value) => value.includes(stoneType) || stoneType.includes(value))
          );

          if (!matchesStoneType) return false;

          if (categoryWallPositions.length === 0) return true;

          return categoryWallPositions.some((wallPosition) =>
            imageWallPositions.includes(wallPosition)
          );
        })
        .map((image) => ({
          id: image._id,
          imageUrl: image.imageUrl,
          title: image.name,
          category: category.name,
          description: image.description || undefined,
          alt: `${image.name} - ${category.name}`,
          width: 1200,
          height: 750,
        }));

      const items = orderCarouselCategoryItems(rawItems, category);

      return {
        ...category,
        items,
        showroomHref: buildShowroomFilterHref(
          category.stoneTypeFilters,
          category.wallPositionFilters
        ),
      };
    });
  }, [data]);

  if (stoneCollectionCategories.length === 0) return null;

  return (
    // FIXED: removed overflow:hidden from CSS on this section.
    // The section now uses isolation:isolate instead, which keeps the
    // stacking context without clipping position:fixed children on iOS Safari.
    <section className="stone-collection-section">
      <div className="stone-collection-container">
        {isLoading ? (
          <div className="stone-collection-status">Đang tải dữ liệu bộ sưu tập...</div>
        ) : error ? (
          <div className="stone-collection-status stone-collection-status--error">
            Không thể tải dữ liệu bộ sưu tập lúc này.
          </div>
        ) : (
          <div className="stone-collection-carousel-stack">
            {categoriesWithItems.map((category, index) => (
              <article
                key={category.id}
                className="stone-collection-carousel-stack-item"
                style={{ '--collection-index': index } as CSSProperties}
              >
                {/*
                  IMPORTANT: Stone3DCarousel must render its fullscreen overlay
                  via createPortal (see Stone3DCarousel.tsx fix below).
                  This ensures the overlay mounts directly on document.body,
                  escaping ALL overflow/clip/transform ancestors — the root
                  cause of the iOS Safari clipping bug shown in the screenshot.
                */}
                <Stone3DCarousel
                  categoryName={category.name}
                  items={category.items}
                  showroomHref={category.showroomHref}
                />
              </article>
            ))}
          </div>
        )}

        <HomeSectionCTA label="Nhận báo giá" className="stone-collection-cta" />
      </div>
    </section>
  );
};

const CollectionSection = () => <StoneCollectionSection />;

export default CollectionSection;