// publicAsset.ts - Build URLs for assets in /public with Vite base path
export const publicAsset = (path: string): string => {
  if (!path) return path;

  // Leave absolute/external/data URLs unchanged
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:')
  ) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalized = path.startsWith('/') ? path.slice(1) : path;

  return `${baseUrl}${normalized}`;
};
