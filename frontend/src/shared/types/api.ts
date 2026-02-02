// shared/types/api.ts - Common API types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
  count?: number;
}
