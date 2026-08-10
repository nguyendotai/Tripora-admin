import { baseApi } from '@/shared/services/base-api';

interface LoginRequest {
  email: string;
  password: string;
}

// role kiểu string đầy đủ từ Backend (kể cả TRAVELER) — AuthUser (chỉ PARTNER/ADMIN/SUPER_ADMIN)
// là type dùng SAU KHI đã kiểm tra role hợp lệ ở trang login, xem app/login/page.tsx.
interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: 'TRAVELER' | 'PARTNER' | 'ADMIN' | 'SUPER_ADMIN';
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
