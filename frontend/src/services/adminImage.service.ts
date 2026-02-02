// adminImage.service.ts - Service để gọi API Admin Image CRUD
import axios from 'axios';
import { apiClient } from './adminAuth.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Interface cho InteriorImage
export interface InteriorImage {
  _id: string;
  name: string;
  stoneType: string;
  wallPosition: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Interface cho Pagination
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Interface cho API Response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
}

/**
 * Tạo hình ảnh mới (Admin only)
 */
export const createImage = async (formData: FormData): Promise<InteriorImage> => {
  try {
    const token = localStorage.getItem('adminToken');
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
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error instanceof Error ? error.message : 'Lỗi khi tạo hình ảnh');
  }
};

/**
 * Lấy danh sách hình ảnh (Admin only)
 */
export const getImages = async (
  stoneType?: string,
  wallPosition?: string,
  page: number = 1,
  limit: number = 50
): Promise<{ images: InteriorImage[]; pagination: Pagination }> => {
  try {
    const params: Record<string, string | number> = {
      page,
      limit,
    };
    if (stoneType) params.stoneType = stoneType;
    if (wallPosition) params.wallPosition = wallPosition;

    const response = await apiClient.get<ApiResponse<InteriorImage[]>>('/admin/images', {
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
        } as Pagination,
      };
    }
    throw new Error(response.data.message || 'Lỗi khi lấy danh sách hình ảnh');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error instanceof Error ? error.message : 'Lỗi khi lấy danh sách hình ảnh');
  }
};

/**
 * Lấy chi tiết 1 hình ảnh (Admin only)
 */
export const getImageById = async (id: string): Promise<InteriorImage> => {
  try {
    const response = await apiClient.get<ApiResponse<InteriorImage>>(`/admin/images/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Lỗi khi lấy chi tiết hình ảnh');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error instanceof Error ? error.message : 'Lỗi khi lấy chi tiết hình ảnh');
  }
};

/**
 * Cập nhật hình ảnh (Admin only)
 */
export const updateImage = async (
  id: string,
  formData: FormData
): Promise<InteriorImage> => {
  try {
    const token = localStorage.getItem('adminToken');
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
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error instanceof Error ? error.message : 'Lỗi khi cập nhật hình ảnh');
  }
};

/**
 * Xóa hình ảnh (Admin only)
 */
export const deleteImage = async (id: string): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse<void>>(`/admin/images/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Lỗi khi xóa hình ảnh');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error instanceof Error ? error.message : 'Lỗi khi xóa hình ảnh');
  }
};

