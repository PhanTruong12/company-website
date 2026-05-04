import type { StoneCollectionItem } from '../data/stoneCollections';
import { getImageUrl } from '../utils/imageUrl';

type StoneImageCardProps = {
  item: StoneCollectionItem;
};

export const StoneImageCard = ({ item }: StoneImageCardProps) => (
  <article className="stone-image-card">
    <div className="stone-image-card-media">
      <img
        src={getImageUrl(item.imageUrl, { width: item.width, height: item.height, crop: 'fill' })}
        alt={item.alt}
        loading="lazy"
        width={item.width}
        height={item.height}
      />
    </div>
  </article>
);
