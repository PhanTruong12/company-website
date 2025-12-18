// SearchBar.tsx - Component search bar với Elasticsearch integration
import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useStoneSearch } from '../../hooks/useStoneSearch';
import { SearchResultItem } from './SearchResultItem';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBar.css';

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 400);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search với debounced query
  const { data: searchResults = [], isLoading } = useStoneSearch(debouncedQuery);

  // Tính toán isOpen dựa trên điều kiện (không dùng useEffect)
  const hasResults = debouncedQuery.length >= 2 && (searchResults.length > 0 || isLoading);
  const isOpen = isFocused && hasResults;

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 2) {
      setIsFocused(true);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsFocused(false);
  };

  const handleResultClick = () => {
    setSearchQuery('');
    setIsFocused(false);
  };

  const handleFocus = () => {
    if (debouncedQuery.length >= 2) {
      setIsFocused(true);
    }
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm đá ..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear"
            onClick={handleClear}
            aria-label="Xóa tìm kiếm"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="search-results-dropdown">
          {isLoading ? (
            <div className="search-loading">Đang tìm kiếm...</div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="search-results-header">
                <span>Tìm thấy {searchResults.length} kết quả</span>
              </div>
              <div className="search-results-list">
                {searchResults.map((result) => (
                  <SearchResultItem
                    key={result._id}
                    result={result}
                    onClick={handleResultClick}
                  />
                ))}
              </div>
            </>
          ) : debouncedQuery.length >= 2 ? (
            <div className="search-no-results">
              Không tìm thấy kết quả nào cho "{debouncedQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

