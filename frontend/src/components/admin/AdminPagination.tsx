import './AdminPagination.css';

const LIMIT_OPTIONS = [12, 24, 48, 100] as const;

export type AdminPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  disabled?: boolean;
};

export const AdminPagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  disabled = false
}: AdminPaginationProps) => {
  const safeTotalPages = Math.max(totalPages, 1);
  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = total === 0 ? 0 : Math.min(page * limit, total);

  return (
    <div className="admin-pagination" role="navigation" aria-label="Phân trang danh sách">
      <div className="admin-pagination-info">
        {total === 0 ? (
          <span>0 ảnh</span>
        ) : (
          <span>
            Hiển thị {start}–{end} / {total} ảnh
          </span>
        )}
      </div>
      <div className="admin-pagination-controls">
        <label className="admin-pagination-label">
          Mỗi trang
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={disabled}
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="admin-pagination-nav">
          <button
            type="button"
            className="admin-pagination-btn"
            onClick={() => onPageChange(page - 1)}
            disabled={!canPrev || disabled}
          >
            Trước
          </button>
          <span className="admin-pagination-page">
            Trang {total === 0 ? 1 : page} / {total === 0 ? 1 : safeTotalPages}
          </span>
          <button
            type="button"
            className="admin-pagination-btn"
            onClick={() => onPageChange(page + 1)}
            disabled={!canNext || disabled}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};
