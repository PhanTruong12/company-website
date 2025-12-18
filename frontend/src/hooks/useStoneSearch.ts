// useStoneSearch.ts - Hook để search đá bằng Elasticsearch
import { useQuery } from '@tanstack/react-query';
import { searchStones, type StoneSearchResult } from '../services/search.service';

/**
 * Hook để search đá bằng Elasticsearch
 * - Không cache (realtime search)
 * - Chỉ search khi query có ít nhất 2 ký tự
 * @param query - Từ khóa tìm kiếm
 */
export const useStoneSearch = (query: string) => {
  const enabled = query.trim().length >= 2;

  return useQuery<StoneSearchResult[], Error>({
    queryKey: ['stone-search', query],
    queryFn: () => searchStones(query),
    enabled, // Chỉ chạy query khi enabled = true
    staleTime: 0, // Không cache
    gcTime: 0, // Không cache
  });
};

