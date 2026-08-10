'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/shared/hooks/use-app-dispatch';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { useIsClient } from '@/shared/hooks/use-is-client';
import { setCredentials, loadAuthFromStorage } from '@/features/auth';

/**
 * Bọc mọi trang cần đăng nhập (Admin/Partner) — tự khôi phục phiên từ localStorage nếu
 * Redux chưa có (ví dụ reload trang), chuyển hướng /login nếu không tìm thấy phiên hợp lệ.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (!isClient || accessToken) return;

    const stored = loadAuthFromStorage();
    if (stored) {
      dispatch(setCredentials(stored));
      return;
    }

    router.replace('/login');
  }, [isClient, accessToken, dispatch, router]);

  if (!isClient || !accessToken) {
    return null;
  }

  return <>{children}</>;
}
