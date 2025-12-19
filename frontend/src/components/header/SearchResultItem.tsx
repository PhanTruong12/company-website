// SearchResultItem.tsx - Component hiển thị một item trong kết quả search
import { Link } from 'react-router-dom';
import { type StoneSearchResult } from '../../services/search.service';
import './SearchResultItem.css';

// Backend base URL để hiển thị ảnh (không có /api ở cuối)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

interface SearchResultItemProps {
  result: StoneSearchResult;
  onClick?: () => void;
}

export const SearchResultItem = ({ result, onClick }: SearchResultItemProps) => {
  const imageUrl = result.imageUrl.startsWith('http')
    ? result.imageUrl
    : `${BACKEND_BASE_URL}${result.imageUrl}`;

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
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
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

