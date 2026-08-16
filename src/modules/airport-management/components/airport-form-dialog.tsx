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
import { useCreateAirportMutation, useUpdateAirportMutation } from "@/features/airport/api/airport.api";
import type { Airport } from "@/features/airport/types/airport.types";

const formSchema = z.object({
  code: z
    .string()
    .regex(/^[A-Z]{3}$/, "Mã IATA phải gồm đúng 3 chữ in hoa (VD: SGN)"),
  name: z.string().min(1, "Vui lòng nhập tên sân bay"),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  country: z.string().min(1, "Vui lòng nhập quốc gia"),
});

type FormValues = z.infer<typeof formSchema>;

export function AirportFormDialog({
  open,
  onOpenChange,
  airport,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  airport?: Airport | null;
}) {
  const isEdit = !!airport;
  const [createAirport, { isLoading: isCreating, error: createError }] = useCreateAirportMutation();
  const [updateAirport, { isLoading: isUpdating }] = useUpdateAirportMutation();
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
        code: airport?.code ?? "",
        name: airport?.name ?? "",
        city: airport?.city ?? "",
        country: airport?.country ?? "",
      });
    }
  }, [open, airport, reset]);

  const errorMessage =
    createError && typeof createError === "object" && "data" in createError
      ? ((createError.data as { message?: string })?.message ?? null)
      : null;

  const onSubmit = async (values: FormValues) => {
    const payload = {
      code: values.code.toUpperCase(),
      name: values.name,
      city: values.city,
      country: values.country,
    };

    if (isEdit && airport) {
      await updateAirport({ id: airport.id, data: payload }).unwrap();
    } else {
      await createAirport(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa sân bay" : "Thêm sân bay"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="code">Mã IATA</Label>
              <Input
                id="code"
                placeholder="SGN"
                maxLength={3}
                className="uppercase"
                {...register("code")}
              />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">Thành phố</Label>
              <Input id="city" placeholder="TP. Hồ Chí Minh" {...register("city")} />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Tên sân bay</Label>
            <Input id="name" placeholder="Sân bay Quốc tế Tân Sơn Nhất" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="country">Quốc gia</Label>
            <Input id="country" placeholder="Vietnam" {...register("country")} />
            {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
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
