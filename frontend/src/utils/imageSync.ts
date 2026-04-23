// imageSync.ts - Đồng bộ hình ảnh giữa Admin và Showroom qua socket + tab local.
import type { ImagesUpdatedPayload, InteriorImage } from '../shared/types';
import { getRealtimeSocket, joinRealtimeChannel } from './realtimeSocket';

const CHANNEL_NAME = 'tnd-images-sync';
const STORAGE_KEY = 'tnd-images-updated';
const SOCKET_EVENT = 'images:updated';
const DEDUP_WINDOW_MS = 300;

let lastNotifyAt = 0;

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

const normalizeInteriorImage = (raw: Record<string, unknown>): InteriorImage => ({
  _id: String(raw._id ?? ''),
  name: String(raw.name ?? ''),
  stoneType: Array.isArray(raw.stoneType)
    ? raw.stoneType.map(String)
    : raw.stoneType != null
    ? String(raw.stoneType)
    : null,
  be_mat:
    Array.isArray(raw.be_mat)
      ? raw.be_mat.map(String)
      : raw.be_mat != null
      ? String(raw.be_mat)
      : raw.hang_muc != null
      ? String(raw.hang_muc)
      : raw.category != null
      ? String(raw.category)
      : null,
  hang_muc: raw.hang_muc != null ? String(raw.hang_muc) : null,
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
  const socket = getRealtimeSocket();
  const leaveRoom = joinRealtimeChannel('images');

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
    leaveRoom();
    if (channel) {
      channel.close();
    }
    window.removeEventListener('storage', onStorage);
  };
};
