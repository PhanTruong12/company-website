// features/search/hooks/useStoneSearch.ts - Hook for stone search
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { searchStones } from '../api';

export const useStoneSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ['stoneSearch', debouncedQuery],
    queryFn: () => searchStones(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
