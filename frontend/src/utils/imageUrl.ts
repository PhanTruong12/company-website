// imageUrl.ts - Utility để xử lý URL ảnh từ backend
// Hỗ trợ cả Cloudinary URL (kèm transform) và local storage URL

import { publicAsset } from './publicAsset';
import { resolveApiBaseUrl } from './apiBaseUrl';

const API_BASE_URL = resolveApiBaseUrl();
const BACKEND_BASE_URL = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, '') : '';

// Debug mode (chỉ log trong development)
const DEBUG = import.meta.env.DEV;

const isCloudinaryUrl = (url: string): boolean =>
  url.includes('cloudinary.com') || url.includes('res.cloudinary.com');

/**
 * Chèn Cloudinary transformation vào URL (sau /upload/, trước /v123/).
 * Ví dụ: width 400 -> w_400,c_fill,q_auto,f_auto
 */
function applyCloudinaryTransform(url: string, options: ImageUrlOptions): string {
  const parts: string[] = [];
  if (options.width != null) parts.push(`w_${options.width}`);
  if (options.height != null) parts.push(`h_${options.height}`);
  parts.push(options.crop ?? 'fill');
  parts.push(options.quality ?? 'auto');
  parts.push(options.format ?? 'auto');
  const transform = parts.join(',');
  return url.replace(/(\/upload\/)/, `$1${transform}/`);
}

export interface ImageUrlOptions {
  /** Chiều rộng (px) - dùng cho thumbnail */
  width?: number;
  /** Chiều cao (px) */
  height?: number;
  /** Crop mode: fill | limit | fit | scale | thumb */
  crop?: string;
  /** Chất lượng: auto | good | eco | low | số */
  quality?: string;
  /** Format: auto | webp | jpg | png */
  format?: string;
}

/**
 * Chuyển đổi imageUrl từ backend thành URL đầy đủ để hiển thị.
 * Nếu là Cloudinary và truyền options (vd. width), URL sẽ dùng transform để tối ưu tải.
 * @param imageUrl - URL từ backend (Cloudinary hoặc relative path)
 * @param options - Tùy chọn transform (chỉ áp dụng cho Cloudinary): width, height, crop, quality, format
 */
export function getImageUrl(
  imageUrl: string | undefined | null,
  options?: ImageUrlOptions
): string {
  if (!imageUrl) {
    if (DEBUG) {
      console.warn('[getImageUrl] No imageUrl provided, using placeholder');
    }
    return publicAsset('placeholder.jpg');
  }

  const isFullUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');

  if (isFullUrl) {
    if (options && isCloudinaryUrl(imageUrl)) {
      return applyCloudinaryTransform(imageUrl, options);
    }
    if (DEBUG && isFullUrl) {
      console.log('[getImageUrl] Using external URL:', imageUrl);
    }
    return imageUrl;
  }

  // Đường dẫn tương đối (/uploads/...) cần ghép với backend URL (cả dev và production)
  if (imageUrl.startsWith('/') && BACKEND_BASE_URL) {
    const baseUrl = BACKEND_BASE_URL.endsWith('/')
      ? BACKEND_BASE_URL.slice(0, -1)
      : BACKEND_BASE_URL;
    return `${baseUrl}${imageUrl}`;
  }

  return imageUrl;
}

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

