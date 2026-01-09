// ShowroomDropdown.tsx - Component dropdown showroom với filter options
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStoneTypes } from '../../hooks/useStoneTypes';
import { useWallPositions } from '../../hooks/useWallPositions';
import { FaChevronDown } from 'react-icons/fa';
import './ShowroomDropdown.css';

export const ShowroomDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy dữ liệu từ React Query (đã cache)
  const { 
    data: stoneTypes = [], 
    isLoading: isLoadingTypes,
    error: stoneTypesError 
  } = useStoneTypes();
  const { 
    data: wallPositions = [], 
    isLoading: isLoadingPositions,
    error: wallPositionsError 
  } = useWallPositions();

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isLoading = isLoadingTypes || isLoadingPositions;

  // Sắp xếp stoneTypes và wallPositions theo bảng chữ cái
  const sortedStoneTypes = [...stoneTypes].sort((a, b) => 
    a.name.localeCompare(b.name, 'vi', { sensitivity: 'base', numeric: true })
  );
  
  const sortedWallPositions = [...wallPositions].sort((a, b) => 
    a.name.localeCompare(b.name, 'vi', { sensitivity: 'base', numeric: true })
  );

  return (
    <div className="showroom-dropdown" ref={dropdownRef}>
      <button
        className="showroom-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Showroom
        <FaChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="showroom-dropdown-menu">
          {isLoading ? (
            <div className="dropdown-loading">Đang tải...</div>
          ) : stoneTypesError || wallPositionsError ? (
            <div className="dropdown-error">
              <p>Lỗi khi tải dữ liệu</p>
              <small>{stoneTypesError?.message || wallPositionsError?.message}</small>
            </div>
          ) : (
            <>
              {/* Stone Types Section */}
              <div className="dropdown-section">
                <h3 className="dropdown-section-title">Loại Đá</h3>
                {sortedStoneTypes.length === 0 ? (
                  <div className="dropdown-empty">Chưa có dữ liệu loại đá</div>
                ) : (
                  <ul className="dropdown-list">
                    {sortedStoneTypes.map((type) => (
                      <li key={type._id}>
                        <Link
                          to={`/showroom?stoneType=${encodeURIComponent(type.name)}`}
                          className="dropdown-item"
                          onClick={() => setIsOpen(false)}
                        >
                        {type.name}
                        {type.nameEn && (
                          <span className="dropdown-item-en"> ({type.nameEn})</span>
                        )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Wall Positions Section */}
              <div className="dropdown-section">
                <h3 className="dropdown-section-title">Vị Trí Ốp</h3>
                <ul className="dropdown-list">
                  {sortedWallPositions.map((position) => (
                    <li key={position._id}>
                      <Link
                        to={`/showroom?wallPosition=${encodeURIComponent(position.name)}`}
                        className="dropdown-item"
                        onClick={() => setIsOpen(false)}
                      >
                        {position.name}
                        {position.nameEn && (
                          <span className="dropdown-item-en"> ({position.nameEn})</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* View All Link */}
              <div className="dropdown-footer">
                <Link
                  to="/showroom"
                  className="dropdown-view-all"
                  onClick={() => setIsOpen(false)}
                >
                  Xem Tất Cả →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

