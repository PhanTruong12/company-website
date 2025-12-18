// adminAuth.service.ts - Service để gọi API Admin Authentication
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Interface cho Admin
export interface Admin {
  id: string;
  email: string;
  role: 'admin' | 'staff';
}

// Interface cho Login Response
export interface LoginResponse {
  token: string;
  admin: Admin;
}

// Interface cho API Response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Tạo instance axios với config mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Lưu token vào localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('adminToken', token);
};

/**
 * Lấy token từ localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

/**
 * Xóa token khỏi localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('adminToken');
};

/**
 * Kiểm tra đã đăng nhập chưa
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Lấy token để gửi trong header
 */
const getAuthHeader = (): string | null => {
  return getAuthToken();
};

// Interceptor để tự động thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthHeader();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi 401 (Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      removeAuthToken();
      // Redirect về trang login nếu đang ở trang admin
      if (window.location.pathname.startsWith('/internal/admin')) {
        window.location.href = '/internal/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Đăng nhập Admin
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/admin/login', {
      email,
      password,
    });

    if (response.data.success && response.data.data) {
      // Lưu token
      setAuthToken(response.data.data.token);
      return response.data.data;
    }
    throw new Error(response.data.message || 'Lỗi khi đăng nhập');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error instanceof Error ? error.message : 'Lỗi khi đăng nhập');
  }
};

/**
 * Đăng xuất Admin
 */
export const logout = (): void => {
  removeAuthToken();
};

/**
 * Lấy thông tin admin hiện tại
 */
export const getMe = async (): Promise<Admin> => {
  try {
    const response = await apiClient.get<ApiResponse<Admin>>('/admin/me');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Lỗi khi lấy thông tin admin');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error instanceof Error ? error.message : 'Lỗi khi lấy thông tin admin');
  }
};

// Export apiClient để sử dụng trong các service khác
export { apiClient };

