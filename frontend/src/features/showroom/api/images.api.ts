// features/showroom/api/images.api.ts - Public interior images API
import { apiClient, handleApiError, type ApiResponse } from '../../../core/api/client';
import type { InteriorImage } from '../../../shared/types';

/**
 * Get interior images (public)
 */
export const getInteriorImages = async (
  stoneType?: string,
  wallPosition?: string
): Promise<InteriorImage[]> => {
  try {
    const params: Record<string, string> = {};
    if (stoneType) params.stoneType = stoneType;
    if (wallPosition) params.wallPosition = wallPosition;

    const response = await apiClient.get<ApiResponse<InteriorImage[]>>('/interior-images', {
      params,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Lỗi khi lấy danh sách hình ảnh');
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get interior image by ID (public)
 */
export const getInteriorImageById = async (id: string): Promise<InteriorImage> => {
  try {
    const response = await apiClient.get<ApiResponse<InteriorImage>>(`/interior-images/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Lỗi khi lấy chi tiết hình ảnh');
  } catch (error) {
    throw handleApiError(error);
  }
};
