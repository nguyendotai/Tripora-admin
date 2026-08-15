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
import { Textarea } from "@/components/ui/textarea";
import { useListDestinationsQuery } from "@/features/destination/api/destination.api";
import { useCreatePropertyMutation, useUpdatePropertyMutation } from "@/features/property/api/property.api";
import type { Property } from "@/features/property/types/property.types";
import { ImageUploadField } from "@/shared/components/image-upload-field";

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên khách sạn"),
  destinationId: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  amenities: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PropertyFormDialog({
  open,
  onOpenChange,
  property,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
}) {
  const isEdit = !!property;
  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();
  const { data: destinations } = useListDestinationsQuery({ limit: 100 });
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
        name: property?.name ?? "",
        destinationId: property?.destinationId ?? "",
        description: property?.description ?? "",
        address: property?.address ?? "",
        checkInTime: property?.checkInTime ?? "",
        checkOutTime: property?.checkOutTime ?? "",
        amenities: property?.amenities?.join(", ") ?? "",
      });
      setImages(property?.images ?? []);
    }
  }, [open, property, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      destinationId: values.destinationId || undefined,
      description: values.description || undefined,
      address: values.address || undefined,
      checkInTime: values.checkInTime || undefined,
      checkOutTime: values.checkOutTime || undefined,
      amenities: values.amenities
        ? values.amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : undefined,
      images: images.length > 0 ? images : undefined,
    };

    if (isEdit && property) {
      await updateProperty({ id: property.id, data: payload }).unwrap();
    } else {
      await createProperty(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[864px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa khách sạn" : "Thêm khách sạn"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Tên khách sạn</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="destinationId">Điểm đến</Label>
              <select
                id="destinationId"
                {...register("destinationId")}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">— Không chọn —</option>
                {destinations?.items.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" {...register("address")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="checkInTime">Giờ nhận phòng</Label>
              <Input id="checkInTime" placeholder="14:00" {...register("checkInTime")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="checkOutTime">Giờ trả phòng</Label>
              <Input id="checkOutTime" placeholder="12:00" {...register("checkOutTime")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amenities">Tiện ích (cách nhau bằng dấu phẩy)</Label>
            <Input id="amenities" placeholder="wifi, hồ bơi, bãi đỗ xe" {...register("amenities")} />
          </div>

          <div className="space-y-1.5">
            <Label>Hình ảnh</Label>
            <ImageUploadField images={images} onChange={setImages} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" rows={4} {...register("description")} />
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
