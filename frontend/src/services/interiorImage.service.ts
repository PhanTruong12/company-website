// interiorImage.service.ts - Service để gọi API InteriorImage
import axios from 'axios';

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

// Interface cho API Response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
}

// Tạo instance axios với config mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Lấy danh sách hình ảnh (có thể filter)
 */
export const getInteriorImages = async (
  stoneType?: string,
  wallPosition?: string
): Promise<InteriorImage[]> => {
  try {
    const params: Record<string, string> = {};
    if (stoneType) params.stoneType = stoneType;
    if (wallPosition) params.wallPosition = wallPosition;

    const response = await apiClient.get<ApiResponse<InteriorImage[]>>(
      '/interior-images',
      { params }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
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
 * Lấy chi tiết 1 hình ảnh
 */
export const getInteriorImageById = async (id: string): Promise<InteriorImage> => {
  try {
    const response = await apiClient.get<ApiResponse<InteriorImage>>(
      `/interior-images/${id}`
    );

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
 * Tạo hình ảnh mới
 */
export const createInteriorImage = async (
  formData: FormData
): Promise<InteriorImage> => {
  try {
    const response = await axios.post<ApiResponse<InteriorImage>>(
      `${API_BASE_URL}/interior-images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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
 * Cập nhật hình ảnh
 */
export const updateInteriorImage = async (
  id: string,
  formData: FormData
): Promise<InteriorImage> => {
  try {
    const response = await axios.put<ApiResponse<InteriorImage>>(
      `${API_BASE_URL}/interior-images/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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
 * Xóa hình ảnh
 */
export const deleteInteriorImage = async (id: string): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/interior-images/${id}`
    );

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

