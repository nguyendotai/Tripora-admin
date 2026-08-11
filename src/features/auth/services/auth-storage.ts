import type { AuthUser } from "../types/auth.types";

const ACCESS_TOKEN_KEY = "tripora_admin_access_token";
const USER_KEY = "tripora_admin_user";

export function saveSession(accessToken: string, user: AuthUser) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function loadSession(): { accessToken: string; user: AuthUser } | null {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  if (!accessToken || !userRaw) return null;

  try {
    return { accessToken, user: JSON.parse(userRaw) as AuthUser };
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
