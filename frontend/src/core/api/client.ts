// core/api/client.ts - Centralized API client configuration
import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Base API client for public endpoints
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Admin API client with authentication interceptors
 */
export const adminApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenStorage = {
  get: (): string | null => localStorage.getItem('adminToken'),
  set: (token: string): void => localStorage.setItem('adminToken', token),
  remove: (): void => localStorage.removeItem('adminToken'),
  has: (): boolean => !!localStorage.getItem('adminToken'),
};

// Admin API client interceptors
adminApiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStorage.remove();
      if (window.location.pathname.startsWith('/internal/admin')) {
        window.location.href = '/internal/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Generic API response type
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  count?: number;
}

/**
 * Handle API errors consistently
 */
export const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.');
    }
  }
  return error instanceof Error ? error : new Error('Đã xảy ra lỗi không xác định');
};
