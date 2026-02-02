// features/showroom/hooks/useStoneTypes.ts - Hook for stone types
import { useQuery } from '@tanstack/react-query';
import { getStoneTypes } from '../api';

export const useStoneTypes = () => {
  return useQuery({
    queryKey: ['stoneTypes'],
    queryFn: getStoneTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
