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
import {
  useCreateAircraftMutation,
  useUpdateAircraftMutation,
} from "@/features/aircraft/api/aircraft.api";
import type { Aircraft } from "@/features/aircraft/types/aircraft.types";

const formSchema = z.object({
  model: z.string().min(1, "Vui lòng nhập model máy bay"),
  registrationCode: z.string().min(1, "Vui lòng nhập số hiệu tàu bay"),
  economyCapacity: z.string().min(1, "Vui lòng nhập sức chứa Economy"),
  businessCapacity: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AircraftFormDialog({
  open,
  onOpenChange,
  aircraft,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aircraft?: Aircraft | null;
}) {
  const isEdit = !!aircraft;
  const [createAircraft, { isLoading: isCreating, error: createError }] = useCreateAircraftMutation();
  const [updateAircraft, { isLoading: isUpdating }] = useUpdateAircraftMutation();
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
        model: aircraft?.model ?? "",
        registrationCode: aircraft?.registrationCode ?? "",
        economyCapacity: aircraft?.economyCapacity ? String(aircraft.economyCapacity) : "",
        businessCapacity: aircraft?.businessCapacity ? String(aircraft.businessCapacity) : "",
      });
    }
  }, [open, aircraft, reset]);

  const errorMessage =
    createError && typeof createError === "object" && "data" in createError
      ? ((createError.data as { message?: string })?.message ?? null)
      : null;

  const onSubmit = async (values: FormValues) => {
    const payload = {
      model: values.model,
      registrationCode: values.registrationCode,
      economyCapacity: Number(values.economyCapacity),
      businessCapacity: values.businessCapacity ? Number(values.businessCapacity) : undefined,
    };

    if (isEdit && aircraft) {
      await updateAircraft({ id: aircraft.id, data: payload }).unwrap();
    } else {
      await createAircraft(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa máy bay" : "Thêm máy bay"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="Airbus A321" {...register("model")} />
              {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="registrationCode">Số hiệu tàu bay</Label>
              <Input id="registrationCode" placeholder="VN-A123" {...register("registrationCode")} />
              {errors.registrationCode && (
                <p className="text-xs text-destructive">{errors.registrationCode.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="economyCapacity">Sức chứa Economy</Label>
              <Input id="economyCapacity" type="number" min={1} {...register("economyCapacity")} />
              {errors.economyCapacity && (
                <p className="text-xs text-destructive">{errors.economyCapacity.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="businessCapacity">Sức chứa Business (tuỳ chọn)</Label>
              <Input id="businessCapacity" type="number" min={0} {...register("businessCapacity")} />
            </div>
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
