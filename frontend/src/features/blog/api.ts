import { apiClient, handleApiError, type ApiResponse } from '../../core/api/client';
import type { BlogPost } from './types';

export const blogApi = {
  async getPosts(): Promise<BlogPost[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<BlogPost[]>>('/posts');
      return data.data ?? [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getPostById(id: string): Promise<BlogPost> {
    try {
      const { data } = await apiClient.get<ApiResponse<BlogPost>>(`/posts/${id}`);
      if (!data.data) throw new Error('Không tìm thấy bài viết');
      return data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createPost(payload: { title: string; content: string; coverImage?: string }): Promise<BlogPost> {
    try {
      const { data } = await apiClient.post<ApiResponse<BlogPost>>('/posts', payload);
      if (!data.data) throw new Error('Không thể tạo bài viết');
      return data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updatePost(id: string, payload: { title: string; content: string; coverImage?: string }): Promise<BlogPost> {
    try {
      const { data } = await apiClient.put<ApiResponse<BlogPost>>(`/posts/${id}`, payload);
      if (!data.data) throw new Error('Không thể cập nhật bài viết');
      return data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deletePost(id: string): Promise<void> {
    try {
      await apiClient.delete(`/posts/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async reactPost(id: string, type: 'like' | 'dislike'): Promise<BlogPost> {
    try {
      const { data } = await apiClient.post<ApiResponse<BlogPost>>(`/posts/${id}/react`, { type });
      if (!data.data) throw new Error('Không thể tương tác bài viết');
      return data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
