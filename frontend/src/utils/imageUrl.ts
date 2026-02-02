// imageUrl.ts - Utility để xử lý URL ảnh từ backend
// Hỗ trợ cả Cloudinary URL và local storage URL

// Lấy API base URL từ environment variable
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Development default
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

// Debug mode (chỉ log trong development)
const DEBUG = import.meta.env.DEV;

/**
 * Chuyển đổi imageUrl từ backend thành URL đầy đủ để hiển thị
 * @param imageUrl - URL từ backend (có thể là Cloudinary URL hoặc relative path)
 * @returns URL đầy đủ để sử dụng trong img src
 */
export const getImageUrl = (imageUrl: string | undefined | null): string => {
  // Nếu không có imageUrl, trả về placeholder
  if (!imageUrl) {
    if (DEBUG) {
      console.warn('[getImageUrl] No imageUrl provided, using placeholder');
    }
    return '/placeholder.jpg';
  }

  // Nếu đã là full URL (Cloudinary hoặc external), trả về trực tiếp
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    if (DEBUG) {
      console.log('[getImageUrl] Using external URL:', imageUrl);
    }
    return imageUrl;
  }

  // Chỉ prepend backend base URL trong development
  // Và chỉ khi imageUrl là relative path bắt đầu bằng "/"
  if (import.meta.env.DEV && imageUrl.startsWith('/')) {
    const baseUrl = BACKEND_BASE_URL.endsWith('/')
      ? BACKEND_BASE_URL.slice(0, -1)
      : BACKEND_BASE_URL;

    const fullUrl = `${baseUrl}${imageUrl}`;

    if (DEBUG) {
      console.log('[getImageUrl] Constructed URL:', {
        original: imageUrl,
        backendBase: BACKEND_BASE_URL,
        final: fullUrl
      });
    }

    return fullUrl;
  }

  // Production: dùng nguyên URL backend trả về
  return imageUrl;
};

/**
 * Kiểm tra xem URL có phải là external URL không
 */
export const isExternalUrl = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Lấy backend base URL (export để sử dụng ở nơi khác nếu cần)
 */
export const getBackendBaseUrl = (): string => {
  return BACKEND_BASE_URL;
};

