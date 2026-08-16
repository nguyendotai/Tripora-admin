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
  useCreateTransportRouteMutation,
  useUpdateTransportRouteMutation,
} from "@/features/transport-route/api/transport-route.api";
import type { TransportRoute } from "@/features/transport-route/types/transport-route.types";

const VEHICLE_TYPES: { value: string; label: string }[] = [
  { value: "", label: "— Loại xe bất kỳ —" },
  { value: "CAR", label: "Xe 4 chỗ" },
  { value: "SUV", label: "SUV" },
  { value: "VAN", label: "Xe 7-16 chỗ" },
  { value: "BUS", label: "Xe khách/Bus" },
  { value: "MOTORBIKE", label: "Xe máy" },
];

const formSchema = z.object({
  origin: z.string().min(1, "Vui lòng nhập điểm đón"),
  destination: z.string().min(1, "Vui lòng nhập điểm đến"),
  vehicleType: z.string().optional(),
  price: z.string().min(1, "Vui lòng nhập giá"),
  estimatedDuration: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function TransportRouteFormDialog({
  open,
  onOpenChange,
  route,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route?: TransportRoute | null;
}) {
  const isEdit = !!route;
  const [createRoute, { isLoading: isCreating, error: createError }] = useCreateTransportRouteMutation();
  const [updateRoute, { isLoading: isUpdating }] = useUpdateTransportRouteMutation();
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
        origin: route?.origin ?? "",
        destination: route?.destination ?? "",
        vehicleType: route?.vehicleType ?? "",
        price: route?.price ?? "",
        estimatedDuration: route?.estimatedDuration ?? "",
      });
    }
  }, [open, route, reset]);

  const errorMessage =
    createError && typeof createError === "object" && "data" in createError
      ? ((createError.data as { message?: string })?.message ?? null)
      : null;

  const onSubmit = async (values: FormValues) => {
    const payload = {
      origin: values.origin,
      destination: values.destination,
      vehicleType: values.vehicleType || undefined,
      price: values.price,
      estimatedDuration: values.estimatedDuration || undefined,
    };

    if (isEdit && route) {
      await updateRoute({ id: route.id, data: payload }).unwrap();
    } else {
      await createRoute(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[864px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa tuyến đường" : "Thêm tuyến đường"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="origin">Điểm đón</Label>
              <Input id="origin" placeholder="Sân bay Tân Sơn Nhất" {...register("origin")} />
              {errors.origin && <p className="text-xs text-destructive">{errors.origin.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="destination">Điểm đến</Label>
              <Input id="destination" placeholder="Quận 1, TP.HCM" {...register("destination")} />
              {errors.destination && (
                <p className="text-xs text-destructive">{errors.destination.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="vehicleType">Loại xe phù hợp</Label>
              <select
                id="vehicleType"
                {...register("vehicleType")}
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
              <Label htmlFor="estimatedDuration">Thời gian di chuyển dự kiến</Label>
              <Input id="estimatedDuration" placeholder="45 phút" {...register("estimatedDuration")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price">Giá (VND)</Label>
            <Input id="price" inputMode="numeric" placeholder="250000" {...register("price")} />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
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
