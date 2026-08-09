export interface AuthUser {
  id: string;
  email: string;
  role: 'PARTNER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
}
