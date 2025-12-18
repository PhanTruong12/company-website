// search.service.ts - Service để search đá bằng Elasticsearch
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Interface cho Search Result
export interface StoneSearchResult {
  _id: string;
  name: string;
  stoneType: string;
  wallPosition: string;
  imageUrl: string;
  slug: string;
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
 * Search đá bằng Elasticsearch
 * @param query - Từ khóa tìm kiếm (hỗ trợ có dấu/không dấu)
 * @returns Danh sách kết quả tìm kiếm
 */
export const searchStones = async (query: string): Promise<StoneSearchResult[]> => {
  // Không search nếu query rỗng hoặc quá ngắn
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await apiClient.get<ApiResponse<StoneSearchResult[]>>(
      '/search/stones',
      {
        params: {
          q: query.trim(),
        },
      }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    // Không throw error để tránh làm gián đoạn UX
    console.error('Search error:', error);
    return [];
  }
};

