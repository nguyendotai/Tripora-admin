"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { useCreateVehicleMutation, useUpdateVehicleMutation } from "@/features/vehicle/api/vehicle.api";
import type { Vehicle, VehicleType } from "@/features/vehicle/types/vehicle.types";
import { ImageUploadField } from "@/shared/components/image-upload-field";

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: "CAR", label: "Xe 4 chỗ" },
  { value: "SUV", label: "SUV" },
  { value: "VAN", label: "Xe 7-16 chỗ" },
  { value: "BUS", label: "Xe khách/Bus" },
  { value: "MOTORBIKE", label: "Xe máy" },
];

const formSchema = z.object({
  type: z.string().min(1, "Vui lòng chọn loại xe"),
  name: z.string().min(1, "Vui lòng nhập tên xe"),
  model: z.string().optional(),
  capacity: z.string().min(1, "Vui lòng nhập sức chứa"),
  features: z.string().optional(),
  licensePlate: z.string().min(1, "Vui lòng nhập biển số"),
});

type FormValues = z.infer<typeof formSchema>;

export function VehicleFormDialog({
  open,
  onOpenChange,
  vehicle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
}) {
  const isEdit = !!vehicle;
  const [createVehicle, { isLoading: isCreating, error: createError }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const isLoading = isCreating || isUpdating;
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (open) {
      reset({
        type: vehicle?.type ?? "CAR",
        name: vehicle?.name ?? "",
        model: vehicle?.model ?? "",
        capacity: vehicle?.capacity ? String(vehicle.capacity) : "",
        features: vehicle?.features?.join(", ") ?? "",
        licensePlate: vehicle?.licensePlate ?? "",
      });
      setImages(vehicle?.images ?? []);
    }
  }, [open, vehicle, reset]);

  const errorMessage =
    createError && typeof createError === "object" && "data" in createError
      ? ((createError.data as { message?: string })?.message ?? null)
      : null;

  const onSubmit = async (values: FormValues) => {
    const payload = {
      type: values.type as VehicleType,
      name: values.name,
      model: values.model || undefined,
      capacity: Number(values.capacity),
      features: values.features
        ? values.features.split(",").map((f) => f.trim()).filter(Boolean)
        : undefined,
      licensePlate: values.licensePlate,
      images: images.length > 0 ? images : undefined,
    };

    if (isEdit && vehicle) {
      await updateVehicle({ id: vehicle.id, data: payload }).unwrap();
    } else {
      await createVehicle(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[864px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa xe" : "Thêm xe"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="type">Loại xe</Label>
              <select
                id="type"
                {...register("type")}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {VEHICLE_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="licensePlate">Biển số</Label>
              <Input id="licensePlate" placeholder="51H-123.45" {...register("licensePlate")} />
              {errors.licensePlate && (
                <p className="text-xs text-destructive">{errors.licensePlate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Tên xe</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="model">Đời xe</Label>
              <Input id="model" placeholder="Vios 2023" {...register("model")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="capacity">Sức chứa (số chỗ)</Label>
              <Input id="capacity" type="number" min={1} {...register("capacity")} />
              {errors.capacity && (
                <p className="text-xs text-destructive">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="features">Tiện ích (cách nhau bằng dấu phẩy)</Label>
            <Input id="features" placeholder="Điều hoà, WiFi, Ghế da" {...register("features")} />
          </div>

          <div className="space-y-1.5">
            <Label>Hình ảnh</Label>
            <ImageUploadField images={images} onChange={setImages} />
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
