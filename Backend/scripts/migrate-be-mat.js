const mongoose = require('mongoose');
const { loadEnv } = require('../src/config/env');
const InteriorImage = require('../src/models/InteriorImage');

const normalizeSurfaceDisplay = (value) => {
  if (typeof value !== 'string') return null;
  const normalized = value
    .trim()
    .replace(/\s+/g, ' ');
  return normalized || null;
};

const normalizeSurfaceKey = (value) => {
  const display = normalizeSurfaceDisplay(value);
  return display ? display.toLocaleLowerCase('vi') : null;
};

const getSourceSurface = (doc) => doc.be_mat ?? doc.hang_muc ?? doc.category ?? null;
const splitSurfaces = (value) => {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((item) => (typeof item === 'string' ? item.split(',') : []))
    .map(normalizeSurfaceDisplay)
    .filter(Boolean);
};

const run = async () => {
  loadEnv();
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is required');
  }

  await mongoose.connect(mongoURI);

  let scanned = 0;
  let updated = 0;
  const bulkOps = [];

  const cursor = InteriorImage.find(
    {},
    { _id: 1, be_mat: 1, hang_muc: 1, category: 1 }
  )
    .lean()
    .cursor();

  for await (const doc of cursor) {
    scanned += 1;
    const displayList = splitSurfaces(getSourceSurface(doc));
    const keyList = [...new Set(displayList.map(normalizeSurfaceKey).filter(Boolean))];
    const currentDisplayList = splitSurfaces(doc.be_mat);
    const currentKeyList = splitSurfaces(doc.be_mat_norm ?? doc.be_mat).map(normalizeSurfaceKey);

    if (
      currentDisplayList.join('|') === displayList.join('|') &&
      currentKeyList.join('|') === keyList.join('|')
    ) {
      continue;
    }

    bulkOps.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { be_mat: displayList, be_mat_norm: keyList } }
      }
    });

    if (bulkOps.length >= 500) {
      const result = await InteriorImage.bulkWrite(bulkOps, { ordered: false });
      updated += result.modifiedCount ?? 0;
      bulkOps.length = 0;
    }
  }

  if (bulkOps.length > 0) {
    const result = await InteriorImage.bulkWrite(bulkOps, { ordered: false });
    updated += result.modifiedCount ?? 0;
  }

  console.log(`[migrate-be-mat] scanned=${scanned} updated=${updated}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('[migrate-be-mat] failed:', error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
