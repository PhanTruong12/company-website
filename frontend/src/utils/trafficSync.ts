import { getRealtimeSocket, joinRealtimeChannel } from './realtimeSocket';

export interface TrafficUpdatedPayload {
  type: 'pageview' | 'click';
  path: string;
  date: string;
  ts: number;
}

const SOCKET_EVENT = 'traffic:updated';

export const subscribeTrafficUpdated = (
  callback: (payload: TrafficUpdatedPayload) => void
): (() => void) => {
  const socket = getRealtimeSocket();
  if (!socket) return () => {};
  const leaveRoom = joinRealtimeChannel('traffic');

  const onSocket = (raw: unknown) => {
    if (!raw || typeof raw !== 'object') return;
    const data = raw as Record<string, unknown>;
    const type = data.type === 'click' ? 'click' : 'pageview';
    callback({
      type,
      path: String(data.path ?? '/'),
      date: String(data.date ?? ''),
      ts: typeof data.ts === 'number' ? data.ts : Date.now(),
    });
  };

  socket.on(SOCKET_EVENT, onSocket);

  return () => {
    socket.off(SOCKET_EVENT, onSocket);
    leaveRoom();
  };
};
