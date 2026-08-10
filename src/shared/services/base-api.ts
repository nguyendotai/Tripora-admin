import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store/store';
import { env } from '@/configs/env';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Phải khớp STORAGE_KEY ở features/auth/services/auth-storage.ts — không import ngược
// từ shared/ sang features/ (folder-structure.md mục 4: Feature -> Shared, không theo chiều ngược lại).
const AUTH_STORAGE_KEY = 'tripora-admin-auth';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

/** accessToken hết hạn (401) — đăng xuất cưỡng bức, chưa có refresh-token rotation ở Admin. */
const baseQueryWithAuthHandling: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch({ type: 'auth/clearCredentials' });
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      // Ngoài React component/Router context (RTK Query baseQuery) nên không dùng được useRouter().
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/login';
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ['Partner', 'Property', 'Product', 'Booking', 'User', 'Destination'],
  endpoints: () => ({}),
});
