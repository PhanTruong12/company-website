// suppressConsoleWarnings.ts - Suppress non-critical console warnings
// Chỉ sử dụng trong development để giảm noise trong console

/**
 * Suppress Permissions Policy violation warnings từ jQuery cũ
 * Đây chỉ là warnings và không ảnh hưởng đến chức năng
 */
export const suppressConsoleWarnings = () => {
  if (import.meta.env.DEV) {
    // Suppress Permissions Policy violation warnings
    const originalWarn = console.warn;
    console.warn = (...args: Parameters<typeof console.warn>) => {
      const message = args[0]?.toString() || '';
      // Bỏ qua warnings về Permissions Policy violation với unload
      if (message.includes('[Violation] Permissions policy violation: unload')) {
        return;
      }
      // Bỏ qua warnings từ jQuery cũ
      if (message.includes('jquery') && message.includes('unload')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    // Suppress console.error cho jQuery unload errors
    const originalError = console.error;
    console.error = (...args: Parameters<typeof console.error>) => {
      const message = args[0]?.toString() || '';
      // Bỏ qua errors về Permissions Policy violation với unload
      if (message.includes('[Violation] Permissions policy violation: unload')) {
        return;
      }
      originalError.apply(console, args);
    };
  }
};

