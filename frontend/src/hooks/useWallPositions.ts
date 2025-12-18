// useWallPositions.ts - Hook để lấy danh sách vị trí ốp với React Query
import { useQuery } from '@tanstack/react-query';
import { getWallPositions, type WallPosition } from '../services/stone.service';

/**
 * Hook để lấy danh sách vị trí ốp
 * - Cache 30 phút
 * - Tự động refetch khi stale
 */
export const useWallPositions = () => {
  return useQuery<WallPosition[], Error>({
    queryKey: ['wall-positions'],
    queryFn: getWallPositions,
    staleTime: 30 * 60 * 1000, // 30 phút
    gcTime: 60 * 60 * 1000, // 1 giờ
  });
};

