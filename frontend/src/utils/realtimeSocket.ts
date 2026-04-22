import { io, type Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;
const joinedChannelRefs = new Map<string, number>();

const isRealtimeEnabled = (): boolean => {
  const raw = import.meta.env.VITE_ENABLE_REALTIME;
  if (raw == null || String(raw).trim() === '') return true;
  return String(raw).toLowerCase() !== 'false';
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

export const getRealtimeSocket = (): Socket | null => {
  if (!isRealtimeEnabled()) return null;
  if (typeof window === 'undefined') return null;
  if (socketInstance) return socketInstance;

  socketInstance = io(getSocketUrl(), {
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  return socketInstance;
};

export const joinRealtimeChannel = (channel: string): (() => void) => {
  const socket = getRealtimeSocket();
  if (!socket || !channel) return () => {};

  const nextCount = (joinedChannelRefs.get(channel) ?? 0) + 1;
  joinedChannelRefs.set(channel, nextCount);
  if (nextCount === 1) {
    socket.emit('channel:join', channel);
  }

  return () => {
    const current = joinedChannelRefs.get(channel) ?? 0;
    if (current <= 1) {
      joinedChannelRefs.delete(channel);
      socket.emit('channel:leave', channel);
      return;
    }
    joinedChannelRefs.set(channel, current - 1);
  };
};
