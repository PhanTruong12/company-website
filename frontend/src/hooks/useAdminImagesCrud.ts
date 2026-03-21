// useAdminImagesCrud.ts - Unified CRUD hook for admin images
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createImage,
  deleteImage,
  getImages,
  updateImage,
} from '../features/admin/api';
import { authService } from '../features/admin/lib/auth';
import type { InteriorImage, Pagination } from '../shared/types';
import { broadcastImagesUpdated } from '../utils/imageSync';

type CrudOptions = {
  stoneType?: string;
  wallPosition?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
};

type CrudResult = {
  images: InteriorImage[];
  pagination?: Pagination;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  createImage: (formData: FormData) => Promise<InteriorImage>;
  updateImage: (id: string, formData: FormData) => Promise<InteriorImage>;
  deleteImage: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
};

export const useAdminImagesCrud = (options: CrudOptions = {}): CrudResult => {
  const {
    stoneType,
    wallPosition,
    page = 1,
    limit = 50,
    enabled = authService.isAuthenticated(),
  } = options;

  const queryClient = useQueryClient();
  const queryKey = ['admin-images', { stoneType, wallPosition, page, limit }];

  const imagesQuery = useQuery({
    queryKey,
    queryFn: () => getImages(stoneType, wallPosition, page, limit),
    enabled,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin-images'] });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (!authService.isAuthenticated()) {
        throw new Error('Chưa đăng nhập');
      }
      return createImage(formData);
    },
    onSuccess: () => {
      invalidate();
      broadcastImagesUpdated();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      authService.isAuthenticated()
        ? updateImage(id, formData)
        : Promise.reject(new Error('Chưa đăng nhập')),
    onSuccess: () => {
      invalidate();
      broadcastImagesUpdated();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      authService.isAuthenticated()
        ? deleteImage(id)
        : Promise.reject(new Error('Chưa đăng nhập')),
    onSuccess: () => {
      invalidate();
      broadcastImagesUpdated();
    },
  });

  return {
    images: imagesQuery.data?.images ?? [],
    pagination: imagesQuery.data?.pagination,
    isLoading: imagesQuery.isLoading,
    error: imagesQuery.error,
    refetch: () => imagesQuery.refetch(),
    createImage: (formData: FormData) => createMutation.mutateAsync(formData),
    updateImage: (id: string, formData: FormData) =>
      updateMutation.mutateAsync({ id, formData }),
    deleteImage: (id: string) => deleteMutation.mutateAsync(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
