// stone.service.ts - Service để gọi API Stone Types và Wall Positions
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Interface cho Stone Type
export interface StoneType {
  _id: string;
  name: string;
  slug?: string;
  nameEn?: string;
  description?: string;
  isActive: boolean;
}

// Interface cho Wall Position
export interface WallPosition {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  isActive: boolean;
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
 * Lấy danh sách loại đá (Stone Types) từ InteriorImage collection
 */
export const getStoneTypes = async (): Promise<StoneType[]> => {
  try {
    const response = await apiClient.get<ApiResponse<StoneType[]>>('/stone-types');

    if (response.data.success && response.data.data) {
      // Filter các loại đá active (nếu có field isActive)
      // Vì data từ InteriorImage không có isActive, nên trả về tất cả
      return response.data.data.filter((type) => type.isActive !== false);
    }
    
    // Nếu API trả về thành công nhưng không có data, trả về mảng rỗng
    if (response.data.success && (!response.data.data || response.data.data.length === 0)) {
      return [];
    }
    
    throw new Error(response.data.message || 'Lỗi khi lấy danh sách loại đá');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.');
      }
    }
    throw new Error(error instanceof Error ? error.message : 'Lỗi khi lấy danh sách loại đá');
  }
};

/**
 * Lấy danh sách vị trí ốp (Wall Positions)
 */
export const getWallPositions = async (): Promise<WallPosition[]> => {
  try {
    const response = await apiClient.get<ApiResponse<WallPosition[]>>('/wall-positions');

    if (response.data.success && response.data.data) {
      return response.data.data.filter((position) => position.isActive);
    }
    throw new Error(response.data.message || 'Lỗi khi lấy danh sách vị trí ốp');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error instanceof Error ? error.message : 'Lỗi khi lấy danh sách vị trí ốp');
  }
};

