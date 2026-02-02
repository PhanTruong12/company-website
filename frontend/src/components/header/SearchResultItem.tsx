// SearchResultItem.tsx - Component hiển thị một item trong kết quả search
import { Link } from 'react-router-dom';
import type { StoneSearchResult } from '../../features/search/api';
import { getImageUrl } from '../../utils/imageUrl';
import { publicAsset } from '../../utils/publicAsset';
import './SearchResultItem.css';

interface SearchResultItemProps {
  result: StoneSearchResult;
  onClick?: () => void;
}

export const SearchResultItem = ({ result, onClick }: SearchResultItemProps) => {
  const imageUrl = getImageUrl(result.imageUrl);

  return (
    <Link
      to={`/showroom/${result.slug}`}
      className="search-result-item"
      onClick={onClick}
    >
      <div className="search-result-thumbnail">
        <img
          src={imageUrl}
          alt={result.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = publicAsset('placeholder.jpg');
          }}
        />
      </div>
      <div className="search-result-info">
        <h4 className="search-result-name">{result.name}</h4>
        <div className="search-result-meta">
          <span className="search-result-tag">{result.stoneType}</span>
          <span className="search-result-tag">{result.wallPosition}</span>
        </div>
      </div>
    </Link>
  );
};

