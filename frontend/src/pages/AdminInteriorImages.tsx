// AdminInteriorImages.tsx - Trang Admin quản lý hình ảnh nội thất
import { useState, useEffect } from 'react';
import {
  getImages,
  createImage,
  updateImage,
  deleteImage,
} from '../features/admin/api';
import type { InteriorImage } from '../shared/types';
import { useStoneTypes } from '../hooks/useStoneTypes';
import { WALL_POSITIONS } from '../constants/wallPositions';
import { getImageUrl } from '../utils/imageUrl';
import './AdminInteriorImages.css';

const AdminInteriorImages = () => {
  const [images, setImages] = useState<InteriorImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    stoneType: '',
    wallPosition: '',
    description: '',
    image: null as File | null,
  });

  // Lấy danh sách loại đá từ API (đã cache bằng React Query)
  const { data: stoneTypesData = [], isLoading: isLoadingStoneTypes } = useStoneTypes();
  // Sử dụng trực tiếp data từ API (đã có name và slug)
  const stoneTypes = stoneTypesData;
  const wallPositions = WALL_POSITIONS;

  // Load danh sách hình ảnh
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getImages();
      setImages(result.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      stoneType: '',
      wallPosition: '',
      description: '',
      image: null,
    });
    setEditingId(null);
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.name || !formData.stoneType || !formData.wallPosition) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!editingId && !formData.image) {
      setError('Vui lòng chọn hình ảnh');
      return;
    }

    setLoading(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('stoneType', formData.stoneType);
      submitFormData.append('wallPosition', formData.wallPosition);
      submitFormData.append('description', formData.description);
      if (formData.image) {
        submitFormData.append('image', formData.image);
      }

      if (editingId) {
        await updateImage(editingId, submitFormData);
      } else {
        await createImage(submitFormData);
      }

      resetForm();
      loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (image: InteriorImage) => {
    setFormData({
      name: image.name,
      stoneType: image.stoneType,
      wallPosition: image.wallPosition,
      description: image.description,
      image: null,
    });
    setEditingId(image._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteImage(id);
      loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-interior-images">
      <div className="admin-container">
        <h1 className="admin-title">Quản Lý Hình Ảnh Nội Thất</h1>

        {/* Form */}
        <div className="admin-form-section">
          <h2 className="form-title">
            {editingId ? 'Sửa Hình Ảnh' : 'Thêm Hình Ảnh Mới'}
          </h2>

          {error && <div className="error-message">{error}</div>}

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
              <label htmlFor="wallPosition">Vị trí ốp trong nhà *</label>
              <select
                id="wallPosition"
                name="wallPosition"
                value={formData.wallPosition}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn vị trí --</option>
                {wallPositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
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
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Đang xử lý...' : editingId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Danh sách hình ảnh */}
        <div className="admin-list-section">
          <h2 className="list-title">Danh Sách Hình Ảnh ({images.length})</h2>

          {loading && !images.length && <div className="loading">Đang tải...</div>}

          {images.length === 0 && !loading && (
            <div className="empty-state">Chưa có hình ảnh nào</div>
          )}

          <div className="images-grid">
            {images.map((image) => (
              <div key={image._id} className="image-card">
                <div className="image-thumbnail">
                  <img
                    src={getImageUrl(image.imageUrl)}
                    alt={image.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="image-info">
                  <h3 className="image-name">{image.name}</h3>
                  <p className="image-detail">
                    <strong>Loại đá:</strong> {image.stoneType}
                  </p>
                  <p className="image-detail">
                    <strong>Vị trí:</strong> {image.wallPosition}
                  </p>
                  {image.description && (
                    <p className="image-description">{image.description}</p>
                  )}
                </div>
                <div className="image-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(image)}
                    disabled={loading}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(image._id)}
                    disabled={loading}
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

