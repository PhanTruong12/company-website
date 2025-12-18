// useStoneTypes.ts - Hook để lấy danh sách loại đá với React Query
import { useQuery } from '@tanstack/react-query';
import { getStoneTypes, type StoneType } from '../services/stone.service';

/**
 * Hook để lấy danh sách loại đá
 * - Cache 30 phút
 * - Tự động refetch khi stale
 * - Có fallback data nếu API lỗi
 */
export const useStoneTypes = () => {
  return useQuery<StoneType[], Error>({
    queryKey: ['stone-types'],
    queryFn: getStoneTypes,
    staleTime: 30 * 60 * 1000, // 30 phút
    gcTime: 60 * 60 * 1000, // 1 giờ
    retry: 1, // Chỉ retry 1 lần
    retryDelay: 1000,
  });
};

