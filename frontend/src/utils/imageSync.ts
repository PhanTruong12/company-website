// imageSync.ts - Đồng bộ hình ảnh giữa Admin và Showroom qua socket + tab local.
import { io, type Socket } from 'socket.io-client';
import type { ImagesUpdatedPayload, InteriorImage } from '../shared/types';

const CHANNEL_NAME = 'tnd-images-sync';
const STORAGE_KEY = 'tnd-images-updated';
const SOCKET_EVENT = 'images:updated';
const DEDUP_WINDOW_MS = 300;

let socketInstance: Socket | null = null;
let lastNotifyAt = 0;

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

const normalizeInteriorImage = (raw: Record<string, unknown>): InteriorImage => ({
  _id: String(raw._id ?? ''),
  name: String(raw.name ?? ''),
  stoneType: String(raw.stoneType ?? ''),
  wallPosition: Array.isArray(raw.wallPosition)
    ? raw.wallPosition.map(String)
    : [],
  description: String(raw.description ?? ''),
  imageUrl: String(raw.imageUrl ?? ''),
  createdAt: String(raw.createdAt ?? ''),
  updatedAt: String(raw.updatedAt ?? ''),
  ...(raw.cloudinaryPublicId != null
    ? { cloudinaryPublicId: raw.cloudinaryPublicId as string | null }
    : {})
});

export const normalizeImagesUpdatedPayload = (raw: unknown): ImagesUpdatedPayload => {
  if (!raw || typeof raw !== 'object') {
    return { action: 'sync', ts: Date.now() };
  }
  const r = raw as Record<string, unknown>;
  const ts = typeof r.ts === 'number' ? r.ts : Date.now();

  if (r.action === 'deleted' && typeof r.imageId === 'string') {
    return { action: 'deleted', imageId: r.imageId, ts };
  }

  if (
    (r.action === 'created' || r.action === 'updated') &&
    r.image &&
    typeof r.image === 'object'
  ) {
    const image = normalizeInteriorImage(r.image as Record<string, unknown>);
    return {
      action: r.action,
      image,
      imageId: image._id,
      ts
    };
  }

  return { action: 'sync', ts };
};

const getSocketUrl = (): string => {
  const explicit = import.meta.env.VITE_SOCKET_URL;
  if (explicit && String(explicit).trim()) {
    return String(explicit).trim().replace(/\/+$/, '');
  }

  const rawBase = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL;
  const base = rawBase ? String(rawBase).trim() : '';
  if (!base) {
    return import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin;
  }

  return base.replace(/\/+$/, '').replace(/\/api$/i, '');
};

const getSocket = (): Socket | null => {
  if (!isBrowser()) return null;
  if (socketInstance) return socketInstance;

  socketInstance = io(getSocketUrl(), {
    transports: ['websocket', 'polling'],
    withCredentials: true
  });

  return socketInstance;
};

const buildPayload = (detail?: {
  action: 'created' | 'updated' | 'deleted';
  image?: InteriorImage;
  imageId?: string;
}): ImagesUpdatedPayload => {
  const ts = Date.now();
  if (!detail) {
    return { action: 'sync', ts };
  }
  if (detail.action === 'deleted') {
    return { action: 'deleted', imageId: String(detail.imageId ?? ''), ts };
  }
  if (detail.image) {
    return {
      action: detail.action,
      image: detail.image,
      imageId: detail.image._id,
      ts
    };
  }
  return { action: 'sync', ts };
};

/**
 * Phát tín hiệu "images updated" cho các tab khác (kèm payload khi có).
 */
export const broadcastImagesUpdated = (detail?: {
  action: 'created' | 'updated' | 'deleted';
  image?: InteriorImage;
  imageId?: string;
}): void => {
  if (!isBrowser()) return;

  const payload = buildPayload(detail);

  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: 'images-updated', payload });
    channel.close();
  } else {
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
export const subscribeImagesUpdated = (
  callback: (payload: ImagesUpdatedPayload) => void
): (() => void) => {
  if (!isBrowser()) return () => {};

  const notify = (payload: ImagesUpdatedPayload) => {
    const now = Date.now();
    if (payload.action !== 'sync' && now - lastNotifyAt < DEDUP_WINDOW_MS) {
      return;
    }
    lastNotifyAt = now;
    callback(payload);
  };

  let channel: BroadcastChannel | null = null;
  const socket = getSocket();

  if ('BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event?.data?.type === 'images-updated') {
        const p = event.data.payload as ImagesUpdatedPayload | undefined;
        notify(p ?? { action: 'sync', ts: Date.now() });
      }
    };
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      notify({ action: 'sync', ts: Date.now() });
    }
  };

  const onSocket = (raw: unknown) => {
    notify(normalizeImagesUpdatedPayload(raw));
  };

  socket?.on(SOCKET_EVENT, onSocket);
  window.addEventListener('storage', onStorage);

  return () => {
    socket?.off(SOCKET_EVENT, onSocket);
    if (channel) {
      channel.close();
    }
    window.removeEventListener('storage', onStorage);
  };
};
