import type { AuthUser } from '../types/auth.types';

const STORAGE_KEY = 'tripora-admin-auth';

interface StoredAuth {
  accessToken: string;
  user: AuthUser;
}

// Lưu tạm phía client để không mất phiên khi reload (chưa có refresh-token rotation ở Admin — xem CLAUDE.md).
export function saveAuthToStorage(auth: StoredAuth) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function loadAuthFromStorage(): StoredAuth | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function clearAuthStorage() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}
