"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateGuideMutation, useUpdateGuideMutation } from "@/features/tour-guide/api/tour-guide.api";
import type { TourGuide } from "@/features/tour-guide/types/tour-guide.types";

const formSchema = z.object({
  email: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function GuideFormDialog({
  open,
  onOpenChange,
  guide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guide?: TourGuide | null;
}) {
  const isEdit = !!guide;
  const [createGuide, { isLoading: isCreating, error: createError }] = useCreateGuideMutation();
  const [updateGuide, { isLoading: isUpdating }] = useUpdateGuideMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (open) {
      reset({
        email: guide?.user.email ?? "",
        bio: guide?.bio ?? "",
        phone: guide?.phone ?? "",
      });
    }
  }, [open, guide, reset]);

  const errorMessage =
    createError && typeof createError === "object" && "data" in createError
      ? ((createError.data as { message?: string })?.message ?? null)
      : null;

  const onSubmit = async (values: FormValues) => {
    if (isEdit && guide) {
      await updateGuide({
        id: guide.id,
        data: { bio: values.bio || undefined, phone: values.phone || undefined },
      }).unwrap();
    } else {
      if (!values.email) {
        setError("email", { message: "Vui lòng nhập email" });
        return;
      }
      await createGuide({
        email: values.email,
        bio: values.bio || undefined,
        phone: values.phone || undefined,
      }).unwrap();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa hướng dẫn viên" : "Thêm hướng dẫn viên"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email tài khoản Tripora</Label>
            <Input id="email" type="email" disabled={isEdit} {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            {!isEdit && (
              <p className="text-xs text-muted-foreground">
                Người này phải đã có tài khoản Tripora — chưa hỗ trợ tạo tài khoản mới từ đây.
              </p>
            )}
            {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" {...register("phone")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Giới thiệu</Label>
            <Textarea id="bio" rows={3} placeholder="Kinh nghiệm, khu vực hoạt động..." {...register("bio")} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-full">
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
