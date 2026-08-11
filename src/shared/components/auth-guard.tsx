"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { loadSession } from "@/features/auth/services/auth-storage";
import { logout, setCredentials } from "@/features/auth/store/auth.slice";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

export function AuthGuard({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      const session = loadSession();
      if (session) {
        dispatch(setCredentials(session));
      }
    }
    setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!checked) return;

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    if (user && user.role !== "ADMIN") {
      dispatch(logout());
      router.replace("/login");
    }
  }, [checked, accessToken, user, dispatch, router]);

  if (!checked || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  return <>{children}</>;
}
