// features/search/api/search.api.ts - Search API
import { apiClient, type ApiResponse } from '../../../core/api/client';

export interface StoneSearchResult {
  _id: string;
  name: string;
  stoneType: string;
  wallPosition: string;
  imageUrl: string;
  slug: string;
}

/**
 * Search stones using Elasticsearch
 * @param query - Search keyword (supports with/without diacritics)
 * @returns List of search results
 */
export const searchStones = async (query: string): Promise<StoneSearchResult[]> => {
  // Don't search if query is empty or too short
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await apiClient.get<ApiResponse<StoneSearchResult[]>>('/search/stones', {
      params: {
        q: query.trim(),
      },
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    // Don't throw error to avoid disrupting UX
    console.error('Search error:', error);
    return [];
  }
};
