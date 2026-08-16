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
import { useCreateDriverMutation, useUpdateDriverMutation } from "@/features/driver/api/driver.api";
import type { Driver } from "@/features/driver/types/driver.types";

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên tài xế"),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function DriverFormDialog({
  open,
  onOpenChange,
  driver,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver?: Driver | null;
}) {
  const isEdit = !!driver;
  const [createDriver, { isLoading: isCreating, error: createError }] = useCreateDriverMutation();
  const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (open) {
      reset({
        name: driver?.name ?? "",
        phone: driver?.phone ?? "",
        licenseNumber: driver?.licenseNumber ?? "",
      });
    }
  }, [open, driver, reset]);

  const errorMessage =
    createError && typeof createError === "object" && "data" in createError
      ? ((createError.data as { message?: string })?.message ?? null)
      : null;

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      phone: values.phone || undefined,
      licenseNumber: values.licenseNumber || undefined,
    };

    if (isEdit && driver) {
      await updateDriver({ id: driver.id, data: payload }).unwrap();
    } else {
      await createDriver(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa tài xế" : "Thêm tài xế"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Họ tên</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" {...register("phone")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="licenseNumber">Số bằng lái</Label>
            <Input id="licenseNumber" placeholder="B2-123456" {...register("licenseNumber")} />
          </div>

          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

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
