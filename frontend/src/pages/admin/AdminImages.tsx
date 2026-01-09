// AdminImages.tsx - Trang quản lý hình ảnh Admin
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getImages,
  createImage,
  updateImage,
  deleteImage,
  type InteriorImage,
} from '../../services/adminImage.service';
import { logout } from '../../services/adminAuth.service';
import { useStoneTypes } from '../../hooks/useStoneTypes';
import { WALL_POSITIONS } from '../../constants/wallPositions';
import { getImageUrl } from '../../utils/imageUrl';
import './AdminImages.css';

const AdminImages = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<InteriorImage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    stoneType: '',
    wallPosition: '',
    description: '',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: stoneTypes = [] } = useStoneTypes();

  // Query để lấy danh sách images
  const {
    data: imagesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-images'],
    queryFn: () => getImages(),
  });

  // Mutation để tạo image
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => createImage(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
      handleCloseModal();
    },
  });

  // Mutation để cập nhật image
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateImage(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
      handleCloseModal();
    },
  });

  // Mutation để xóa image
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
    },
  });

  const handleOpenModal = (image?: InteriorImage) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        name: image.name,
        stoneType: image.stoneType,
        wallPosition: image.wallPosition,
        description: image.description,
        image: null,
      });
      setImagePreview(getImageUrl(image.imageUrl));
    } else {
      setEditingImage(null);
      setFormData({
        name: '',
        stoneType: '',
        wallPosition: '',
        description: '',
        image: null,
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingImage(null);
    setFormData({
      name: '',
      stoneType: '',
      wallPosition: '',
      description: '',
      image: null,
    });
    setImagePreview(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitFormData = new FormData();
    submitFormData.append('name', formData.name);
    submitFormData.append('stoneType', formData.stoneType);
    submitFormData.append('wallPosition', formData.wallPosition);
    submitFormData.append('description', formData.description);
    if (formData.image) {
      submitFormData.append('image', formData.image);
    }

    try {
      if (editingImage) {
        await updateMutation.mutateAsync({
          id: editingImage._id,
          formData: submitFormData,
        });
      } else {
        await createMutation.mutateAsync(submitFormData);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/internal/admin/login';
  };

  const images = imagesData?.images || [];

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
      {error && (
        <div className="admin-error">
          Lỗi: {error instanceof Error ? error.message : 'Không thể tải dữ liệu'}
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
                      <span className="badge badge-position">{image.wallPosition}</span>
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
                      disabled={deleteMutation.isPending}
                      title="Xóa hình ảnh"
                    >
                      <span className="btn-icon">🗑️</span>
                      <span>{deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}</span>
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
                <select
                  name="wallPosition"
                  value={formData.wallPosition}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn vị trí --</option>
                  {WALL_POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
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
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
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

