// AdminImages.tsx - Trang quản lý hình ảnh Admin
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../features/admin/lib/auth';
import type { InteriorImage } from '../../shared/types';
import { useStoneTypes } from '../../hooks/useStoneTypes';
import { WALL_POSITIONS } from '../../constants/wallPositions';
import { getImageUrl } from '../../utils/imageUrl';
import { buildImageFormData } from '../../utils/imageForm';
import { useImageForm } from '../../hooks/useImageForm';
import { useAdminImagesCrud } from '../../hooks/useAdminImagesCrud';
import { getImageSurfaces } from '../../features/admin/api';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import './AdminImages.css';

const AdminImages = () => {
  const toStoneTypeList = (value: InteriorImage['stoneType']): string[] => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };
  const toSurfaceList = (image: InteriorImage): string[] => {
    const source = image.be_mat ?? image.hang_muc;
    if (Array.isArray(source)) {
      return source.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof source === 'string') {
      return source.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  const resolveBeMat = (image: InteriorImage): string =>
    toSurfaceList(image).join(', ');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<InteriorImage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    formData,
    resetForm,
    setFromImage,
    handleInputChange,
    handleFileChange,
    toggleStoneType,
    toggleWallPosition,
  } = useImageForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: stoneTypes = [] } = useStoneTypes();
  const { data: beMatOptions = [] } = useQuery({
    queryKey: ['admin-image-surfaces'],
    queryFn: getImageSurfaces,
    staleTime: 5 * 60 * 1000,
  });

  const {
    images,
    pagination,
    isLoading,
    isFetching,
    error,
    createImage: createImageAsync,
    updateImage: updateImageAsync,
    deleteImage: deleteImageAsync,
    isCreating,
    isUpdating,
  } = useAdminImagesCrud({ page, limit: pageSize });

  useEffect(() => {
    if (!pagination || pagination.totalPages === 0) return;
    if (page > pagination.totalPages) {
      const next = pagination.totalPages;
      queueMicrotask(() => setPage(next));
    }
  }, [pagination, page]);

  const handleOpenModal = (image?: InteriorImage) => {
    if (image) {
      setEditingImage(image);
      setFromImage(image);
      setImagePreview(getImageUrl(image.imageUrl));
    } else {
      setEditingImage(null);
      resetForm();
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingImage(null);
    resetForm();
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, (previewUrl) => setImagePreview(previewUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.stoneType.length === 0) {
      alert('Vui lòng chọn ít nhất một loại đá.');
      return;
    }

    const submitFormData = buildImageFormData(formData);

    try {
      if (editingImage) {
        await updateImageAsync(editingImage._id, submitFormData);
      } else {
        await createImageAsync(submitFormData);
      }
      handleCloseModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteImageAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/internal/admin/login';
  };

  const errorMessage = error instanceof Error ? error.message : null;
  const totalImages = pagination?.total ?? images.length;
  const recentlyUpdated = [...images]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5)
    .map((item) => ({
      title: item.name,
      meta: `Cập nhật: ${new Date(item.updatedAt).toLocaleString('vi-VN')}`,
    }));

  return (
    <AdminDashboardLayout
      title="Dashboard Quản Lý Ảnh Showroom"
      subtitle="Quản trị dữ liệu hình ảnh theo loại đá và vị trí ốp."
      activeTab="images"
      onLogout={handleLogout}
      actions={
        <button onClick={() => handleOpenModal()} className="btn-primary">
          + Thêm Ảnh Mới
        </button>
      }
      stats={[
        { label: 'Tổng ảnh', value: totalImages },
        { label: 'Trang hiện tại', value: pagination?.page ?? page },
        { label: 'Số ảnh / trang', value: pageSize },
      ]}
      insights={[
        {
          title: 'Tỉ lệ lấp đầy trang',
          value: `${Math.min(100, Math.round((images.length / pageSize) * 100))}%`,
          tone: 'positive',
        },
        {
          title: 'Tổng số trang',
          value: pagination?.totalPages ?? 1,
          tone: 'neutral',
        },
        {
          title: 'Đồng bộ dữ liệu',
          value: isFetching ? 'Đang cập nhật' : 'Ổn định',
          tone: isFetching ? 'warning' : 'positive',
        },
      ]}
      activityItems={recentlyUpdated}
    >

      {isLoading && <div className="admin-loading">Đang tải...</div>}
      {errorMessage && (
        <div className="admin-error">
          Lỗi: {errorMessage}
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="admin-images-stats">
            Tổng số hình ảnh:{' '}
            <strong>{pagination?.total ?? images.length}</strong>
            {isFetching && !isLoading && (
              <span className="admin-images-refreshing"> · Đang cập nhật…</span>
            )}
          </div>

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
              disabled={isCreating || isUpdating}
            />
          )}

          {images.length === 0 ? (
            <div className="admin-empty">Chưa có hình ảnh nào. Hãy thêm hình ảnh mới!</div>
          ) : (
            <div className="admin-images-grid">
              {images.map((image) => (
                <div
                  key={image._id}
                  className={`admin-image-card ${deletingId === image._id ? 'is-deleting' : ''}`}
                >
                  <div className="admin-image-thumbnail">
                    <img
                      src={getImageUrl(image.imageUrl, { width: 400, crop: 'fill' })}
                      alt={image.name}
                      loading="lazy"
                    />
                    <div className="admin-image-overlay">
                      <button
                        onClick={() => handleOpenModal(image)}
                        className="btn-overlay-edit"
                        title="Sửa"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                  <div className="admin-image-info">
                    <h3 className="admin-image-title">{image.name}</h3>
                    <div className="admin-image-badges">
                      {toStoneTypeList(image.stoneType).map((type) => (
                        <span key={`${image._id}-stone-${type}`} className="badge badge-stone">{type}</span>
                      ))}
                      {resolveBeMat(image) ? (
                        <span className="badge badge-category">{resolveBeMat(image)}</span>
                      ) : (
                        <span className="badge badge-category badge-empty">Chưa cập nhật</span>
                      )}
                      <span className="badge badge-position">
                        {Array.isArray(image.wallPosition)
                          ? image.wallPosition.join(', ')
                          : image.wallPosition}
                      </span>
                    </div>
                    {image.description && (
                      <p className="admin-image-description">{image.description}</p>
                    )}
                  </div>
                  <div className="admin-image-actions">
                    <button
                      onClick={() => handleOpenModal(image)}
                      className="btn-edit"
                      title="Sửa hình ảnh"
                    >
                      <span className="btn-icon">✏️</span>
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="btn-delete"
                      disabled={deletingId !== null}
                      title="Xóa hình ảnh"
                    >
                      <span className="btn-icon">🗑️</span>
                      <span>{deletingId === image._id ? 'Đang xóa...' : 'Xóa'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingImage ? 'Sửa Hình Ảnh' : 'Thêm Hình Ảnh Mới'}</h2>
              <button onClick={handleCloseModal} className="admin-modal-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-form">
              <div className="admin-form-field">
                <label>Tên ảnh *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label>Loại đá *</label>
                <div className="multi-select">
                  {stoneTypes.map((type) => {
                    const selected = formData.stoneType.includes(type.name);
                    return (
                      <label
                        key={type._id}
                        className={`multi-option ${selected ? 'is-selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          name="stoneType"
                          value={type.name}
                          checked={selected}
                          onChange={() => toggleStoneType(type.name)}
                        />
                        <span>{type.name}</span>
                      </label>
                    );
                  })}
                </div>
                <small className="form-hint">Chọn một hoặc nhiều loại đá phù hợp</small>
              </div>

              <div className="admin-form-field">
                <label>Bề mặt</label>
                <input
                  type="text"
                  name="be_mat"
                  value={formData.be_mat}
                  onChange={handleInputChange}
                  list="admin-image-surfaces"
                  placeholder="Ví dụ: đen nhám, trắng vân mây (ngăn cách bằng dấu phẩy)"
                />
                <datalist id="admin-image-surfaces">
                  {beMatOptions.map((surface) => (
                    <option key={surface} value={surface} />
                  ))}
                </datalist>
              </div>

              <div className="admin-form-field">
                <label>Vị trí ốp *</label>
                <div className="multi-select">
                  {WALL_POSITIONS.map((position) => {
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

              <div className="admin-form-field">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="admin-form-field">
                <label>Hình ảnh {!editingImage && '*'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingImage}
                />
                {imagePreview && (
                  <div className="admin-image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={
                    isCreating ||
                    isUpdating
                  }
                >
                  {isCreating || isUpdating
                    ? 'Đang lưu...'
                    : editingImage
                    ? 'Cập Nhật'
                    : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminImages;

