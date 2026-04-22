const { Server } = require('socket.io');

let ioInstance = null;

const SOCKET_CHANNELS = {
  ADMIN: 'admin',
  IMAGES: 'images',
  BLOG: 'blog',
  TRAFFIC: 'traffic',
};

const isRealtimeEnabled = () => String(process.env.REALTIME_ENABLED ?? 'true').toLowerCase() !== 'false';

const getAllowedOrigins = () => {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());
  }
  return ['http://localhost:5173', 'http://localhost:3000'];
};

const socketCorsOrigin = (origin, callback) => {
  const allowedOrigins = getAllowedOrigins();

  if (!origin) {
    return callback(null, true);
  }

  const isLocalhost = origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:') ||
    origin.includes('localhost');

  if (isLocalhost) {
    return callback(null, true);
  }

  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error('Not allowed by CORS'));
};

const initializeSocket = (httpServer) => {
  if (!isRealtimeEnabled()) {
    ioInstance = null;
    return null;
  }

  ioInstance = new Server(httpServer, {
    cors: {
      origin: socketCorsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
    }
  });

  ioInstance.on('connection', (socket) => {
    // Join admin room by convention when client explicitly opts in.
    socket.on('channel:join', (channel) => {
      if (typeof channel !== 'string') return;
      if (!Object.values(SOCKET_CHANNELS).includes(channel)) return;
      socket.join(channel);
    });

    socket.on('channel:leave', (channel) => {
      if (typeof channel !== 'string') return;
      if (!Object.values(SOCKET_CHANNELS).includes(channel)) return;
      socket.leave(channel);
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔌 Socket connected: ${socket.id}`);
    }

    socket.on('disconnect', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
      }
    });
  });

  return ioInstance;
};

const getIO = () => ioInstance;

module.exports = {
  SOCKET_CHANNELS,
  initializeSocket,
  getIO,
  isRealtimeEnabled,
};
