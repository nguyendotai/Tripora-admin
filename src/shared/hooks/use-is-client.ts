import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Trả về true chỉ sau khi hydrate xong ở client — dùng để tránh mismatch SSR/CSR
 * (ví dụ đọc theme hiện tại từ next-themes) mà không cần setState trong useEffect.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
