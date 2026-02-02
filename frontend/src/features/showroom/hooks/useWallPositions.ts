// features/showroom/hooks/useWallPositions.ts - Hook for wall positions
import { useQuery } from '@tanstack/react-query';
import { getWallPositions } from '../api';

export const useWallPositions = () => {
  return useQuery({
    queryKey: ['wallPositions'],
    queryFn: getWallPositions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
