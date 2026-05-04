// features/showroom/api/images.api.ts - Public interior images API
import {
  apiClient,
  handleApiError,
  type ApiResponse,
  type Pagination,
} from '../../../core/api/client';
import type { InteriorImage } from '../../../shared/types';

/** Kích thước trang showroom (load more) — khớp mặc định backend */
export const SHOWROOM_PAGE_SIZE = 12;

/**
 * Mỗi request GET /interior-images bị giới hạn bởi Backend `PAGINATION.MAX_LIMIT` (100).
 * Dùng khi cần lấy toàn bộ ảnh qua nhiều trang.
 */
export const INTERIOR_IMAGES_MAX_PAGE_SIZE = 100;

const FETCH_ALL_MAX_PAGES = 500;

export type InteriorImagesPageResult = {
  images: InteriorImage[];
  pagination: Pagination;
};

/**
 * Get interior images (public, paginated)
 */
export const getInteriorImages = async (
  stoneType?: string,
  be_mat?: string,
  wallPosition?: string | string[],
  page: number = 1,
  limit: number = SHOWROOM_PAGE_SIZE
): Promise<InteriorImagesPageResult> => {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (stoneType) params.stoneType = stoneType;
    if (be_mat) params.be_mat = be_mat;
    if (wallPosition) {
      params.wallPosition = Array.isArray(wallPosition)
        ? wallPosition.join(',')
        : wallPosition;
    }

    const response = await apiClient.get<ApiResponse<InteriorImage[]>>('/interior-images', {
      params,
    });

    if (response.data.success && response.data.data) {
      const p = response.data.pagination;
      return {
        images: response.data.data,
        pagination: p ?? {
          page,
          limit,
          total: response.data.data.length,
          totalPages:
            response.data.data.length === 0
              ? 0
              : Math.ceil(response.data.data.length / limit),
        },
      };
    }
    throw new Error(response.data.message || 'Lỗi khi lấy danh sách hình ảnh');
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Lấy toàn bộ ảnh nội thất khớp filter (gọi lặp theo trang cho đến hết).
 * Public API mỗi trang tối đa {@link INTERIOR_IMAGES_MAX_PAGE_SIZE} bản ghi.
 */
export const fetchAllInteriorImages = async (
  stoneType?: string,
  be_mat?: string,
  wallPosition?: string | string[]
): Promise<InteriorImage[]> => {
  const limit = INTERIOR_IMAGES_MAX_PAGE_SIZE;
  const accumulated: InteriorImage[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const { images, pagination } = await getInteriorImages(stoneType, be_mat, wallPosition, page, limit);
    accumulated.push(...images);
    totalPages = pagination.totalPages > 0 ? pagination.totalPages : 1;

    if (images.length === 0) {
      break;
    }

    page += 1;
  } while (page <= totalPages && page <= FETCH_ALL_MAX_PAGES);

  return accumulated;
};

/**
 * Get dynamic surfaces for showroom filter
 */
export const getInteriorImageSurfaces = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<ApiResponse<string[]>>('/interior-images/surfaces');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.success) {
      return [];
    }
    throw new Error(response.data.message || 'Lỗi khi lấy danh sách bề mặt');
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
