"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetMyGuideProfileQuery,
  useUpdateMyGuideProfileMutation,
} from "@/features/tour-guide/api/tour-guide.api";
import { TourGuideStatusBadge } from "@/modules/tour-guide-management/components/tour-guide-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

const formSchema = z.object({
  bio: z.string().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function GuideProfilePage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: profile, isLoading } = useGetMyGuideProfileQuery();
  const [updateProfile, { isLoading: isSaving, isSuccess }] = useUpdateMyGuideProfileMutation();

  useEffect(() => {
    if (user && !user.guideId) {
      router.replace("/");
    }
  }, [user, router]);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({ bio: profile.bio ?? "", phone: profile.phone ?? "" });
    }
  }, [profile, reset]);

  const onSubmit = async (values: FormValues) => {
    await updateProfile({ bio: values.bio || undefined, phone: values.phone || undefined }).unwrap();
  };

  return (
    <>
      <Header title="Hồ sơ của tôi" />

      <main className="p-6">
        <div className="max-w-xl rounded-[var(--radius-lg)] border border-border bg-card p-5">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : !profile ? (
            <p className="text-sm text-destructive">Không tải được hồ sơ.</p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <TourGuideStatusBadge status={profile.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Trạng thái do Tour Operator quản lý.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" {...register("phone")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bio">Giới thiệu</Label>
                  <Textarea id="bio" rows={4} {...register("bio")} />
                </div>

                {isSuccess && <p className="text-xs text-primary">Đã lưu.</p>}

                <Button type="submit" disabled={isSaving} className="rounded-full">
                  {isSaving ? "Đang lưu..." : "Lưu hồ sơ"}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}
