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
  /** Cùng lúc với providerId — dùng để tách UI/redirect giữa Hotel Provider và Tour Operator. */
  providerType?: "HOTEL" | "TOUR" | "ACTIVITY" | "TRANSPORT" | "FLIGHT";
  /** V7 vòng 1 — vai trò của tài khoản này trong tổ chức (Owner từ lúc được duyệt, hoặc Manager/Booking Staff/Finance Staff được mời sau). Không đến từ Backend AuthResponse. */
  orgRole?: "OWNER" | "MANAGER" | "BOOKING_STAFF" | "FINANCE_STAFF";
  /** Gắn ở phía client nếu role != ADMIN, không có Provider profile, nhưng có hồ sơ Tour Guide. */
  guideId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}
