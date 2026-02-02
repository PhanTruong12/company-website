// features/admin/api/auth.api.ts - Admin authentication API
import { adminApiClient, handleApiError, type ApiResponse } from '../../../core/api/client';
import type { Admin, LoginResponse } from '../../../shared/types';

/**
 * Admin login
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await adminApiClient.post<ApiResponse<LoginResponse>>('/admin/login', {
      email,
      password,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Lỗi khi đăng nhập');
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get current admin info
 */
export const getMe = async (): Promise<Admin> => {
  try {
    const response = await adminApiClient.get<ApiResponse<Admin>>('/admin/me');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Lỗi khi lấy thông tin admin');
  } catch (error) {
    throw handleApiError(error);
  }
};
