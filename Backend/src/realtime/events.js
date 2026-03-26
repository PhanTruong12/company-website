const { getIO } = require('./socket');

const SOCKET_EVENTS = {
  IMAGES_UPDATED: 'images:updated'
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
    io.emit(SOCKET_EVENTS.IMAGES_UPDATED, {
      action: 'deleted',
      imageId: String(payload.imageId),
      ts
    });
    return;
  }

  const image = serializeImage(payload.image);
  if (!image || !image._id) return;

  io.emit(SOCKET_EVENTS.IMAGES_UPDATED, {
    action: payload.action,
    image,
    imageId: image._id,
    ts
  });
};

module.exports = {
  SOCKET_EVENTS,
  emitImagesUpdated,
  serializeImage
};
