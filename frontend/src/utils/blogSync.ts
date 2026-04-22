import type { BlogPost } from '../features/blog/types';
import { getRealtimeSocket, joinRealtimeChannel } from './realtimeSocket';

type BlogAction = 'created' | 'updated' | 'reacted' | 'viewed' | 'deleted';

export interface BlogUpdatedPayload {
  action: BlogAction;
  postId: string;
  post?: BlogPost;
  ts: number;
}

const SOCKET_EVENT = 'posts:updated';

export const normalizeBlogUpdatedPayload = (raw: unknown): BlogUpdatedPayload => {
  if (!raw || typeof raw !== 'object') {
    return { action: 'updated', postId: '', ts: Date.now() };
  }

  const data = raw as Record<string, unknown>;
  const action = (data.action as BlogAction) || 'updated';
  const ts = typeof data.ts === 'number' ? data.ts : Date.now();
  const postId = typeof data.postId === 'string' ? data.postId : '';
  const post = data.post as BlogPost | undefined;

  return { action, postId, post, ts };
};

export const subscribeBlogUpdated = (callback: (payload: BlogUpdatedPayload) => void): (() => void) => {
  const socket = getRealtimeSocket();
  if (!socket) return () => {};
  const leaveRoom = joinRealtimeChannel('blog');

  const onSocket = (raw: unknown) => callback(normalizeBlogUpdatedPayload(raw));
  socket.on(SOCKET_EVENT, onSocket);

  return () => {
    socket.off(SOCKET_EVENT, onSocket);
    leaveRoom();
  };
};
