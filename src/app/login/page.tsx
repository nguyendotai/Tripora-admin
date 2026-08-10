'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Compass } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAppDispatch } from '@/shared/hooks/use-app-dispatch';
import { useLoginMutation, setCredentials, saveAuthToStorage } from '@/features/auth';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      const result = await login(values).unwrap();

      const { role } = result.user;
      if (role === 'TRAVELER') {
        setFormError('Tài khoản này không có quyền truy cập Tripora Admin.');
        return;
      }

      const session = { accessToken: result.accessToken, user: { ...result.user, role } };
      dispatch(setCredentials(session));
      saveAuthToStorage(session);
      router.replace('/');
    } catch {
      setFormError('Email hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground">
            <Compass className="size-5" />
          </span>
          <CardTitle className="text-xl">
            Tripora <span className="text-primary">Admin</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Đăng nhập dành cho Admin và Partner</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <Button type="submit" disabled={isLoading} className="mt-2">
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
