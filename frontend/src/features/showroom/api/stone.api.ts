// features/showroom/api/stone.api.ts - Stone types and wall positions API
import { apiClient, handleApiError, type ApiResponse } from '../../../core/api/client';
import type { StoneType, WallPosition } from '../../../shared/types';

/**
 * Get stone types
 */
export const getStoneTypes = async (): Promise<StoneType[]> => {
  try {
    const response = await apiClient.get<ApiResponse<StoneType[]>>('/stone-types');

    if (response.data.success && response.data.data) {
      return response.data.data.filter((type) => type.isActive !== false);
    }

    if (response.data.success && (!response.data.data || response.data.data.length === 0)) {
      return [];
    }

    throw new Error(response.data.message || 'Lỗi khi lấy danh sách loại đá');
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get wall positions
 */
export const getWallPositions = async (): Promise<WallPosition[]> => {
  try {
    const response = await apiClient.get<ApiResponse<WallPosition[]>>('/wall-positions');

    if (response.data.success && response.data.data) {
      return response.data.data.filter((position) => position.isActive);
    }
    throw new Error(response.data.message || 'Lỗi khi lấy danh sách vị trí ốp');
  } catch (error) {
    throw handleApiError(error);
  }
};
