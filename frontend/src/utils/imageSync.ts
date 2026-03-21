// imageSync.ts - Đồng bộ hình ảnh giữa Admin và Showroom (realtime nhẹ)
// Sử dụng BroadcastChannel (nếu hỗ trợ) hoặc fallback qua localStorage.

const CHANNEL_NAME = 'tnd-images-sync';
const STORAGE_KEY = 'tnd-images-updated';

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Phát tín hiệu "images updated" cho các tab khác.
 * Gọi sau khi tạo / cập nhật / xóa hình ảnh thành công ở Admin.
 */
export const broadcastImagesUpdated = (): void => {
  if (!isBrowser()) return;

  // BroadcastChannel (hiện đại, hỗ trợ đa tab tốt)
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: 'images-updated', ts: Date.now() });
    channel.close();
  } else {
    // Fallback: kích hoạt sự kiện 'storage' giữa các tab
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore quota / private mode errors
    }
  }
};

/**
 * Lắng nghe tín hiệu "images updated".
 * Trả về hàm unsubscribe để cleanup trong useEffect.
 */
export const subscribeImagesUpdated = (callback: () => void): (() => void) => {
  if (!isBrowser()) return () => {};

  let channel: BroadcastChannel | null = null;

  if ('BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event?.data?.type === 'images-updated') {
        callback();
      }
    };
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener('storage', onStorage);

  return () => {
    if (channel) {
      channel.close();
    }
    window.removeEventListener('storage', onStorage);
  };
};

