/**
 * Chuẩn hóa base URL API (backend mount route dưới `/api`).
 * Có thể set `VITE_API_BASE_URL` chỉ là origin (vd. Railway) — hàm này tự thêm `/api` nếu thiếu.
 */
export function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL;
  const trimmed = raw != null ? String(raw).trim() : '';
  if (!trimmed) {
    return import.meta.env.DEV ? 'http://localhost:5000/api' : '';
  }
  const noTrailing = trimmed.replace(/\/+$/, '');
  if (noTrailing.toLowerCase().endsWith('/api')) {
    return noTrailing;
  }
  return `${noTrailing}/api`;
}
