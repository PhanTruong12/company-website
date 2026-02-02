// features/admin/api/images.api.ts - Admin images API
import axios from 'axios';
import { adminApiClient, handleApiError, tokenStorage, type ApiResponse, type Pagination } from '../../../core/api/client';
import type { InteriorImage } from '../../../shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Create new image (Admin only)
 */
export const createImage = async (formData: FormData): Promise<InteriorImage> => {
  try {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    const response = await axios.post<ApiResponse<InteriorImage>>(
      `${API_BASE_URL}/admin/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Lỗi khi tạo hình ảnh');
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get images list (Admin only)
 */
export const getImages = async (
  stoneType?: string,
  wallPosition?: string,
  page: number = 1,
  limit: number = 50
): Promise<{ images: InteriorImage[]; pagination: Pagination }> => {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (stoneType) params.stoneType = stoneType;
    if (wallPosition) params.wallPosition = wallPosition;

    const response = await adminApiClient.get<ApiResponse<InteriorImage[]>>('/admin/images', {
      params,
    });

    if (response.data.success && response.data.data) {
      return {
        images: response.data.data,
        pagination: response.data.pagination || {
          page: 1,
          limit: 50,
          total: response.data.data.length,
          totalPages: 1,
        },
      };
    }
    throw new Error(response.data.message || 'Lỗi khi lấy danh sách hình ảnh');
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get image by ID (Admin only)
 */
export const getImageById = async (id: string): Promise<InteriorImage> => {
  try {
    const response = await adminApiClient.get<ApiResponse<InteriorImage>>(`/admin/images/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Lỗi khi lấy chi tiết hình ảnh');
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update image (Admin only)
 */
export const updateImage = async (
  id: string,
  formData: FormData
): Promise<InteriorImage> => {
  try {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    const response = await axios.put<ApiResponse<InteriorImage>>(
      `${API_BASE_URL}/admin/images/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Lỗi khi cập nhật hình ảnh');
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete image (Admin only)
 */
export const deleteImage = async (id: string): Promise<void> => {
  try {
    const response = await adminApiClient.delete<ApiResponse<void>>(`/admin/images/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Lỗi khi xóa hình ảnh');
    }
  } catch (error) {
    throw handleApiError(error);
  }
};
