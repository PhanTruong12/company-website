import { adminApiClient, handleApiError, type ApiResponse } from '../../../core/api/client';

export interface AdminBlogPost {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  content: string;
  coverImage?: string;
  likes: number;
  dislikes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export const getAdminBlogs = async (): Promise<AdminBlogPost[]> => {
  try {
    const response = await adminApiClient.get<ApiResponse<AdminBlogPost[]>>('/admin/blogs');
    if (response.data.success && response.data.data) return response.data.data;
    return [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createAdminBlog = async (
  payload: { title: string; slug?: string; description?: string; content: string; coverImage?: string }
): Promise<AdminBlogPost> => {
  try {
    const response = await adminApiClient.post<ApiResponse<AdminBlogPost>>('/admin/blogs', payload);
    if (!response.data.data) throw new Error(response.data.message || 'Không thể tạo blog');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAdminBlog = async (
  id: string,
  payload: { title: string; slug?: string; description?: string; content: string; coverImage?: string }
): Promise<AdminBlogPost> => {
  try {
    const response = await adminApiClient.put<ApiResponse<AdminBlogPost>>(`/admin/blogs/${id}`, payload);
    if (!response.data.data) throw new Error(response.data.message || 'Không thể cập nhật blog');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAdminBlog = async (id: string): Promise<void> => {
  try {
    await adminApiClient.delete(`/admin/blogs/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};
