import { apiClient } from '../../core/api/client';

type TrafficEvent = {
  type: 'pageview' | 'click';
  path: string;
  target?: string;
};

const SESSION_KEY = 'traffic_session_id';
const PAGEVIEW_THROTTLE_MS = 30_000;
const CLICK_THROTTLE_MS = 3_000;
const memoryStore = new Map<string, string>();

const canUseSessionStorage = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return false;
    const probeKey = '__traffic_storage_probe__';
    window.sessionStorage.setItem(probeKey, '1');
    window.sessionStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
};

const readStorage = (key: string): string | null => {
  if (canUseSessionStorage()) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      // Fall through to in-memory store when browser blocks storage access.
    }
  }
  return memoryStore.get(key) ?? null;
};

const writeStorage = (key: string, value: string) => {
  if (canUseSessionStorage()) {
    try {
      window.sessionStorage.setItem(key, value);
      return;
    } catch {
      // Fall through to in-memory store when browser blocks storage access.
    }
  }
  memoryStore.set(key, value);
};

const getSessionId = () => {
  const existing = readStorage(SESSION_KEY);
  if (existing) return existing;
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  writeStorage(SESSION_KEY, id);
  return id;
};

const shouldTrackNow = (key: string, ttl: number) => {
  const now = Date.now();
  const raw = readStorage(key);
  if (!raw) {
    writeStorage(key, String(now));
    return true;
  }
  const previous = Number(raw);
  if (!Number.isFinite(previous) || now - previous > ttl) {
    writeStorage(key, String(now));
    return true;
  }
  return false;
};

const normalizeTarget = (target?: string) => {
  if (!target) return '';
  return target.replace(/\s+/g, ' ').trim().slice(0, 120);
};

const sendEvent = async (event: TrafficEvent) => {
  try {
    await apiClient.post('/traffic/track', {
      ...event,
      target: normalizeTarget(event.target),
      sessionId: getSessionId(),
    });
  } catch {
    // Tracking must never break UI flow.
  }
};

export const trackPageView = (path: string) => {
  const key = `traffic_pv_${path}`;
  if (!shouldTrackNow(key, PAGEVIEW_THROTTLE_MS)) return;
  void sendEvent({ type: 'pageview', path });
};

export const trackClick = (path: string, target: string) => {
  const targetKey = normalizeTarget(target) || 'unknown';
  const key = `traffic_click_${path}_${targetKey}`;
  if (!shouldTrackNow(key, CLICK_THROTTLE_MS)) return;
  void sendEvent({ type: 'click', path, target: targetKey });
};
