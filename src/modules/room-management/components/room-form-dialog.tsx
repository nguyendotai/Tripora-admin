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
import { useCreateRoomMutation, useUpdateRoomMutation } from "@/features/room/api/room.api";
import type { Room } from "@/features/room/types/room.types";

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên loại phòng"),
  description: z.string().optional(),
  capacity: z.string().optional(),
  beds: z.string().optional(),
  basePrice: z.string().min(1, "Vui lòng nhập giá"),
  amenities: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function RoomFormDialog({
  open,
  onOpenChange,
  propertyId,
  room,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  room?: Room | null;
}) {
  const isEdit = !!room;
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
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
        name: room?.name ?? "",
        description: room?.description ?? "",
        capacity: room?.capacity ? String(room.capacity) : "",
        beds: room?.beds?.join(", ") ?? "",
        basePrice: room?.basePrice ?? "",
        amenities: room?.amenities?.join(", ") ?? "",
      });
    }
  }, [open, room, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      capacity: values.capacity ? Number(values.capacity) : undefined,
      beds: values.beds ? values.beds.split(",").map((b) => b.trim()).filter(Boolean) : undefined,
      basePrice: Number(values.basePrice),
      amenities: values.amenities
        ? values.amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : undefined,
    };

    if (isEdit && room) {
      await updateRoom({ id: room.id, propertyId, data: payload }).unwrap();
    } else {
      await createRoom({ propertyId, ...payload }).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[864px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa loại phòng" : "Thêm loại phòng"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Tên loại phòng</Label>
            <Input id="name" placeholder="Deluxe Room" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="capacity">Sức chứa (khách)</Label>
              <Input id="capacity" type="number" min={1} {...register("capacity")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="basePrice">Giá / đêm (VND)</Label>
              <Input id="basePrice" type="number" min={0} {...register("basePrice")} />
              {errors.basePrice && (
                <p className="text-xs text-destructive">{errors.basePrice.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="beds">Giường (cách nhau bằng dấu phẩy)</Label>
              <Input id="beds" placeholder="1 giường đôi, 1 giường đơn" {...register("beds")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amenities">Tiện ích (cách nhau bằng dấu phẩy)</Label>
              <Input id="amenities" placeholder="wifi, tv, điều hoà" {...register("amenities")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" rows={3} {...register("description")} />
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
