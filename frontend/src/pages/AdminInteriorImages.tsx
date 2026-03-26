// AdminInteriorImages.tsx - Trang Admin quản lý hình ảnh nội thất
import { useState, useEffect } from 'react';
import type { InteriorImage } from '../shared/types';
import { useStoneTypes } from '../hooks/useStoneTypes';
import { WALL_POSITIONS } from '../constants/wallPositions';
import { getImageUrl } from '../utils/imageUrl';
import { publicAsset } from '../utils/publicAsset';
import { buildImageFormData } from '../utils/imageForm';
import { useImageForm } from '../hooks/useImageForm';
import { useAdminImagesCrud } from '../hooks/useAdminImagesCrud';
import { AdminPagination } from '../components/admin/AdminPagination';
import './AdminInteriorImages.css';

const AdminInteriorImages = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const {
    formData,
    resetForm,
    setFromImage,
    handleInputChange,
    handleFileChange: handleFileInputChange,
    toggleWallPosition,
  } = useImageForm();

  // Lấy danh sách loại đá từ API (đã cache bằng React Query)
  const { data: stoneTypesData = [], isLoading: isLoadingStoneTypes } = useStoneTypes();
  // Sử dụng trực tiếp data từ API (đã có name và slug)
  const stoneTypes = stoneTypesData;
  const wallPositions = WALL_POSITIONS;

  const {
    images,
    pagination,
    isLoading,
    isFetching,
    error: queryError,
    createImage: createImageAsync,
    updateImage: updateImageAsync,
    deleteImage: deleteImageAsync,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminImagesCrud({ page, limit: pageSize });

  useEffect(() => {
    if (!pagination || pagination.totalPages === 0) return;
    if (page > pagination.totalPages) {
      const next = pagination.totalPages;
      queueMicrotask(() => setPage(next));
    }
  }, [pagination, page]);

  // Reset form
  const handleResetForm = () => {
    resetForm();
    setEditingId(null);
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInputChange(e);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.name || !formData.stoneType || formData.wallPosition.length === 0) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!editingId && !formData.image) {
      setError('Vui lòng chọn hình ảnh');
      return;
    }

    try {
      const submitFormData = buildImageFormData(formData);

      if (editingId) {
        await updateImageAsync(editingId, submitFormData);
      } else {
        await createImageAsync(submitFormData);
      }

      handleResetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  // Handle edit
  const handleEdit = (image: InteriorImage) => {
    setFromImage(image);
    setEditingId(image._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      return;
    }

    try {
      await deleteImageAsync(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  const queryErrorMessage =
    queryError instanceof Error ? queryError.message : null;

  return (
    <div className="admin-interior-images">
      <div className="admin-container">
        <h1 className="admin-title">Quản Lý Hình Ảnh Nội Thất</h1>

        {/* Form */}
        <div className="admin-form-section">
          <h2 className="form-title">
            {editingId ? 'Sửa Hình Ảnh' : 'Thêm Hình Ảnh Mới'}
          </h2>

        {(error || queryErrorMessage) && (
          <div className="error-message">
            {error || queryErrorMessage || 'Có lỗi xảy ra'}
          </div>
        )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Tên ảnh *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Nhập tên ảnh"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stoneType">Loại đá ốp tường *</label>
              <select
                id="stoneType"
                name="stoneType"
                value={formData.stoneType}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn loại đá --</option>
                {isLoadingStoneTypes ? (
                  <option disabled>Đang tải...</option>
                ) : (
                  stoneTypes.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Vị trí ốp trong nhà *</label>
              <div className="multi-select">
                {wallPositions.map((position) => {
                  const selected = formData.wallPosition.includes(position);
                  return (
                    <label
                      key={position}
                      className={`multi-option ${selected ? 'is-selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        name="wallPosition"
                        value={position}
                        checked={selected}
                        onChange={() => toggleWallPosition(position)}
                      />
                      <span>{position}</span>
                    </label>
                  );
                })}
              </div>
              <small className="form-hint">Chọn một hoặc nhiều vị trí phù hợp</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Nhập mô tả (tùy chọn)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">
                Hình ảnh {!editingId && '*'}
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                required={!editingId}
              />
              {editingId && (
                <small className="form-hint">
                  Để trống nếu không muốn thay đổi ảnh
                </small>
              )}
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isLoading || isCreating || isUpdating || isDeleting}>
                {isLoading || isCreating || isUpdating || isDeleting ? 'Đang xử lý...' : editingId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetForm}
                  disabled={isLoading || isCreating || isUpdating || isDeleting}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Danh sách hình ảnh */}
        <div className="admin-list-section">
          <h2 className="list-title">
            Danh Sách Hình Ảnh (
            {pagination?.total ?? images.length}
            {isFetching && !isLoading ? ' · …' : ''})
          </h2>

          {pagination && pagination.total > 0 && (
            <AdminPagination
              page={page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pageSize}
              onPageChange={setPage}
              onLimitChange={(n) => {
                setPageSize(n);
                setPage(1);
              }}
              disabled={isCreating || isUpdating || isDeleting}
            />
          )}

          {isLoading && !images.length && <div className="loading">Đang tải...</div>}

          {images.length === 0 && !isLoading && (
            <div className="empty-state">Chưa có hình ảnh nào</div>
          )}

          <div className="images-grid">
            {images.map((image) => (
              <div key={image._id} className="image-card">
                <div className="image-thumbnail">
                  <img
                    src={getImageUrl(image.imageUrl, { width: 400, crop: 'fill' })}
                    alt={image.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = publicAsset('placeholder.jpg');
                    }}
                  />
                </div>
                <div className="image-info">
                  <h3 className="image-name">{image.name}</h3>
                  <p className="image-detail">
                    <strong>Loại đá:</strong> {image.stoneType}
                  </p>
                  <p className="image-detail">
                    <strong>Vị trí:</strong>{' '}
                    {Array.isArray(image.wallPosition)
                      ? image.wallPosition.join(', ')
                      : image.wallPosition}
                  </p>
                  {image.description && (
                    <p className="image-description">{image.description}</p>
                  )}
                </div>
                <div className="image-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(image)}
                    disabled={isLoading || isCreating || isUpdating || isDeleting}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(image._id)}
                    disabled={isLoading || isCreating || isUpdating || isDeleting}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInteriorImages;

