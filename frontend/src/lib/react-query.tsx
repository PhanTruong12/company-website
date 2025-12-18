// react-query.tsx - React Query Provider Setup
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Tạo QueryClient với config tối ưu cho SSR và cache
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 30 phút
      gcTime: 60 * 60 * 1000, // 1 giờ (cacheTime đã đổi tên thành gcTime trong v5)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ReactQueryProviderProps {
  children: ReactNode;
}

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

