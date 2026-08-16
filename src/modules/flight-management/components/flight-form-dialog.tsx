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
import { useListAirportsQuery } from "@/features/airport/api/airport.api";
import { useListMyAircraftQuery } from "@/features/aircraft/api/aircraft.api";
import { useCreateFlightMutation, useUpdateFlightMutation } from "@/features/flight/api/flight.api";
import type { Flight } from "@/features/flight/types/flight.types";

const formSchema = z.object({
  aircraftId: z.string().min(1, "Chọn máy bay"),
  flightNumber: z.string().min(1, "Vui lòng nhập số hiệu chuyến bay"),
  departureAirportId: z.string().min(1, "Chọn sân bay đi"),
  arrivalAirportId: z.string().min(1, "Chọn sân bay đến"),
  duration: z.string().min(1, "Vui lòng nhập thời gian bay"),
});

type FormValues = z.infer<typeof formSchema>;

export function FlightFormDialog({
  open,
  onOpenChange,
  flight,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flight?: Flight | null;
}) {
  const isEdit = !!flight;
  const [createFlight, { isLoading: isCreating, error: createError }] = useCreateFlightMutation();
  const [updateFlight, { isLoading: isUpdating }] = useUpdateFlightMutation();
  const isLoading = isCreating || isUpdating;

  const { data: aircraftList } = useListMyAircraftQuery();
  const approvedAircraft = aircraftList?.items.filter((a) => a.status === "APPROVED") ?? [];
  const { data: airportList } = useListAirportsQuery({ limit: 100 });
  const airports = airportList?.items ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (open) {
      reset({
        aircraftId: flight?.aircraftId ?? "",
        flightNumber: flight?.flightNumber ?? "",
        departureAirportId: flight?.departureAirportId ?? "",
        arrivalAirportId: flight?.arrivalAirportId ?? "",
        duration: flight?.duration ? String(flight.duration) : "",
      });
    }
  }, [open, flight, reset]);

  const errorMessage =
    createError && typeof createError === "object" && "data" in createError
      ? ((createError.data as { message?: string })?.message ?? null)
      : null;

  const onSubmit = async (values: FormValues) => {
    const payload = {
      aircraftId: values.aircraftId,
      flightNumber: values.flightNumber,
      departureAirportId: values.departureAirportId,
      arrivalAirportId: values.arrivalAirportId,
      duration: Number(values.duration),
    };

    if (isEdit && flight) {
      await updateFlight({ id: flight.id, data: payload }).unwrap();
    } else {
      await createFlight(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[864px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa chuyến bay" : "Thêm chuyến bay"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="flightNumber">Số hiệu chuyến bay</Label>
              <Input id="flightNumber" placeholder="VN123" {...register("flightNumber")} />
              {errors.flightNumber && (
                <p className="text-xs text-destructive">{errors.flightNumber.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="aircraftId">Máy bay</Label>
              <select
                id="aircraftId"
                {...register("aircraftId")}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">— Chọn máy bay —</option>
                {approvedAircraft.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.model} ({a.registrationCode})
                  </option>
                ))}
              </select>
              {errors.aircraftId && (
                <p className="text-xs text-destructive">{errors.aircraftId.message}</p>
              )}
              {approvedAircraft.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Chưa có máy bay nào đã được duyệt — thêm máy bay trước ở &quot;Máy bay của
                  tôi&quot;.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="departureAirportId">Sân bay đi</Label>
              <select
                id="departureAirportId"
                {...register("departureAirportId")}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">— Chọn sân bay đi —</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} — {a.city}
                  </option>
                ))}
              </select>
              {errors.departureAirportId && (
                <p className="text-xs text-destructive">{errors.departureAirportId.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="arrivalAirportId">Sân bay đến</Label>
              <select
                id="arrivalAirportId"
                {...register("arrivalAirportId")}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">— Chọn sân bay đến —</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} — {a.city}
                  </option>
                ))}
              </select>
              {errors.arrivalAirportId && (
                <p className="text-xs text-destructive">{errors.arrivalAirportId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="duration">Thời gian bay (phút)</Label>
            <Input id="duration" type="number" min={1} placeholder="120" {...register("duration")} />
            {errors.duration && <p className="text-xs text-destructive">{errors.duration.message}</p>}
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
