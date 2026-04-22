const { getIO, SOCKET_CHANNELS } = require('./socket');

const SOCKET_EVENTS = {
  IMAGES_UPDATED: 'images:updated',
  POSTS_UPDATED: 'posts:updated',
  TRAFFIC_UPDATED: 'traffic:updated',
};

const serializeImage = (doc) => {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  if (o._id) o._id = String(o._id);
  if (o.createdAt) {
    o.createdAt = o.createdAt instanceof Date ? o.createdAt.toISOString() : String(o.createdAt);
  }
  if (o.updatedAt) {
    o.updatedAt = o.updatedAt instanceof Date ? o.updatedAt.toISOString() : String(o.updatedAt);
  }
  return o;
};

/**
 * @param {{ action: 'created'|'updated', image: object } | { action: 'deleted', imageId: string }}} payload
 */
const emitImagesUpdated = (payload) => {
  const io = getIO();
  if (!io) return;

  const ts = Date.now();

  if (payload.action === 'deleted') {
    io.to(SOCKET_CHANNELS.IMAGES).emit(SOCKET_EVENTS.IMAGES_UPDATED, {
      action: 'deleted',
      imageId: String(payload.imageId),
      ts
    });
    return;
  }

  const image = serializeImage(payload.image);
  if (!image || !image._id) return;

  io.to(SOCKET_CHANNELS.IMAGES).emit(SOCKET_EVENTS.IMAGES_UPDATED, {
    action: payload.action,
    image,
    imageId: image._id,
    ts
  });
};

const serializePost = (doc) => {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  if (o._id) o._id = String(o._id);
  if (o.createdAt) {
    o.createdAt = o.createdAt instanceof Date ? o.createdAt.toISOString() : String(o.createdAt);
  }
  if (o.updatedAt) {
    o.updatedAt = o.updatedAt instanceof Date ? o.updatedAt.toISOString() : String(o.updatedAt);
  }
  return o;
};

/**
 * @param {{ action: 'created'|'updated'|'reacted'|'viewed', post: object } | { action: 'deleted', postId: string }} payload
 */
const emitPostsUpdated = (payload) => {
  const io = getIO();
  if (!io) return;

  const ts = Date.now();
  if (payload.action === 'deleted') {
    io.to(SOCKET_CHANNELS.BLOG).emit(SOCKET_EVENTS.POSTS_UPDATED, {
      action: 'deleted',
      postId: String(payload.postId),
      ts,
    });
    return;
  }

  const post = serializePost(payload.post);
  if (!post || !post._id) return;

  io.to(SOCKET_CHANNELS.BLOG).emit(SOCKET_EVENTS.POSTS_UPDATED, {
    action: payload.action,
    post,
    postId: post._id,
    ts,
  });
};

/**
 * @param {{ type: 'pageview'|'click', path: string, date: string }} payload
 */
const emitTrafficUpdated = (payload) => {
  const io = getIO();
  if (!io) return;

  io.to(SOCKET_CHANNELS.TRAFFIC).emit(SOCKET_EVENTS.TRAFFIC_UPDATED, {
    ...payload,
    ts: Date.now(),
  });
};

module.exports = {
  SOCKET_EVENTS,
  emitImagesUpdated,
  emitPostsUpdated,
  emitTrafficUpdated,
  serializeImage,
  serializePost,
};
