"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/features/auth/api/auth.api";
import { saveSession } from "@/features/auth/services/auth-storage";
import { logout, setCredentials } from "@/features/auth/store/auth.slice";
import { useLazyGetMyProviderQuery } from "@/features/provider/api/provider.api";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { Logo } from "@/shared/components/logo";

const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [getMyProvider, { isFetching: isCheckingProvider }] = useLazyGetMyProviderQuery();
  const [roleError, setRoleError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setRoleError(false);
    const result = await login(values).unwrap();

    if (result.user.role === "ADMIN") {
      dispatch(setCredentials(result));
      saveSession(result.accessToken, result.user);
      router.push("/");
      return;
    }

    // Không phải ADMIN — thử xem có phải Provider đã được duyệt không.
    dispatch(setCredentials(result));
    try {
      const provider = await getMyProvider().unwrap();
      if (provider.status !== "APPROVED") {
        throw new Error("not approved");
      }
      const user = { ...result.user, providerId: provider.id };
      dispatch(setCredentials({ accessToken: result.accessToken, user }));
      saveSession(result.accessToken, user);
      router.push("/my-properties");
    } catch {
      dispatch(logout());
      setRoleError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm rounded-[var(--radius-xl)] border border-border bg-card p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>

        <h1 className="mt-6 text-center text-xl font-bold">Đăng nhập Admin</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">Email hoặc mật khẩu không đúng.</p>
          )}
          {roleError && (
            <p className="text-sm text-destructive">
              Tài khoản này không có quyền truy cập trang quản trị.
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading || isCheckingProvider}
            className="w-full rounded-full"
          >
            {isLoading || isCheckingProvider ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </div>
    </div>
  );
}
