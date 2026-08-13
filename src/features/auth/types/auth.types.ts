export interface AuthUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: "USER" | "ADMIN";
  status: string;
  createdAt: string;
  /** Gắn ở phía client sau khi login nếu role != ADMIN nhưng có Provider profile APPROVED. Không đến từ Backend AuthResponse. */
  providerId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}
