// AdminImages.tsx - Trang quản lý hình ảnh Admin
import { useState } from 'react';
import { authService } from '../../features/admin/lib/auth';
import type { InteriorImage } from '../../shared/types';
import { useStoneTypes } from '../../hooks/useStoneTypes';
import { WALL_POSITIONS } from '../../constants/wallPositions';
import { getImageUrl } from '../../utils/imageUrl';
import { buildImageFormData } from '../../utils/imageForm';
import { useImageForm } from '../../hooks/useImageForm';
import { useAdminImagesCrud } from '../../hooks/useAdminImagesCrud';
import './AdminImages.css';

const AdminImages = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<InteriorImage | null>(null);
  const {
    formData,
    resetForm,
    setFromImage,
    handleInputChange,
    handleFileChange,
    toggleWallPosition,
  } = useImageForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: stoneTypes = [] } = useStoneTypes();

  const {
    images,
    isLoading,
    error,
    createImage: createImageAsync,
    updateImage: updateImageAsync,
    deleteImage: deleteImageAsync,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminImagesCrud();

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

    try {
      await deleteImageAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/internal/admin/login';
  };

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className="admin-images-container">
      <div className="admin-images-header">
        <h1>Quản Lý Hình Ảnh Showroom</h1>
        <div className="admin-images-actions">
          <button onClick={() => handleOpenModal()} className="btn-primary">
            + Thêm Ảnh Mới
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Đăng Xuất
          </button>
        </div>
      </div>

      {isLoading && <div className="admin-loading">Đang tải...</div>}
      {errorMessage && (
        <div className="admin-error">
          Lỗi: {errorMessage}
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="admin-images-stats">
            Tổng số hình ảnh: <strong>{images.length}</strong>
          </div>

          {images.length === 0 ? (
            <div className="admin-empty">Chưa có hình ảnh nào. Hãy thêm hình ảnh mới!</div>
          ) : (
            <div className="admin-images-grid">
              {images.map((image) => (
                <div key={image._id} className="admin-image-card">
                  <div className="admin-image-thumbnail">
                    <img
                      src={getImageUrl(image.imageUrl)}
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
                      <span className="badge badge-stone">{image.stoneType}</span>
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
                      disabled={isDeleting}
                      title="Xóa hình ảnh"
                    >
                      <span className="btn-icon">🗑️</span>
                      <span>{isDeleting ? 'Đang xóa...' : 'Xóa'}</span>
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
                <select
                  name="stoneType"
                  value={formData.stoneType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn loại đá --</option>
                  {stoneTypes.map((type) => (
                    <option key={type._id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
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
    </div>
  );
};

export default AdminImages;

