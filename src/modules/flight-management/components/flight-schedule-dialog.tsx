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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useListMyFlightScheduleQuery,
  useSetFlightScheduleMutation,
} from "@/features/flight-schedule/api/flight-schedule.api";
import type { Flight } from "@/features/flight/types/flight.types";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultRange() {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 29);
  return { startDate: toDateInput(start), endDate: toDateInput(end) };
}

const formSchema = z
  .object({
    startDate: z.string().min(1, "Chọn ngày bắt đầu"),
    endDate: z.string().min(1, "Chọn ngày kết thúc"),
    departureTime: z.string().regex(TIME_PATTERN, "Định dạng HH:mm"),
    arrivalTime: z.string().regex(TIME_PATTERN, "Định dạng HH:mm"),
    economyPrice: z.string().min(1, "Nhập giá Economy"),
    businessPrice: z.string().optional(),
  })
  .refine((v) => v.startDate <= v.endDate, {
    message: "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof formSchema>;

export function FlightScheduleDialog({
  open,
  onOpenChange,
  flight,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flight: Flight | null;
}) {
  const [viewRange, setViewRange] = useState(defaultRange());

  useEffect(() => {
    if (open) {
      setViewRange(defaultRange());
    }
  }, [open]);

  const {
    data: schedule,
    isLoading,
    isError,
  } = useListMyFlightScheduleQuery(
    flight ? { flightId: flight.id, ...viewRange } : { flightId: "", startDate: "", endDate: "" },
    { skip: !open || !flight },
  );

  const [setFlightSchedule, { isLoading: isSaving }] = useSetFlightScheduleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (open) {
      reset({ ...defaultRange(), departureTime: "08:00", arrivalTime: "10:00", economyPrice: "", businessPrice: "" });
    }
  }, [open, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!flight) return;
    await setFlightSchedule({
      flightId: flight.id,
      startDate: values.startDate,
      endDate: values.endDate,
      departureTime: values.departureTime,
      arrivalTime: values.arrivalTime,
      economyPrice: Number(values.economyPrice),
      businessPrice: values.businessPrice ? Number(values.businessPrice) : undefined,
    }).unwrap();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[1536px]">
        <DialogHeader>
          <DialogTitle>
            Lịch bay — {flight?.flightNumber} ({flight?.departureAirport?.code} →{" "}
            {flight?.arrivalAirport?.code})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Từ ngày</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">Đến ngày</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
              {errors.endDate && (
                <p className="text-xs text-destructive">{errors.endDate.message}</p>
              )}
            </div>
            <div />
            <div className="space-y-1.5">
              <Label htmlFor="departureTime">Giờ khởi hành</Label>
              <Input id="departureTime" placeholder="08:00" {...register("departureTime")} />
              {errors.departureTime && (
                <p className="text-xs text-destructive">{errors.departureTime.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="arrivalTime">Giờ hạ cánh</Label>
              <Input id="arrivalTime" placeholder="10:00" {...register("arrivalTime")} />
              {errors.arrivalTime && (
                <p className="text-xs text-destructive">{errors.arrivalTime.message}</p>
              )}
            </div>
            <div />
            <div className="space-y-1.5">
              <Label htmlFor="economyPrice">Giá Economy (VND)</Label>
              <Input id="economyPrice" type="number" min={0} {...register("economyPrice")} />
              {errors.economyPrice && (
                <p className="text-xs text-destructive">{errors.economyPrice.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="businessPrice">Giá Business (để trống nếu máy bay không có hạng này)</Label>
              <Input id="businessPrice" type="number" min={0} {...register("businessPrice")} />
            </div>
          </div>

          <DialogFooter className="justify-start sm:justify-start">
            <Button type="submit" disabled={isSaving} className="rounded-full">
              {isSaving ? "Đang lưu..." : "Áp dụng cho khoảng ngày trên"}
            </Button>
          </DialogFooter>
        </form>

        <div className="rounded-[var(--radius-md)] border border-border">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
            <p className="text-sm font-medium">Xem lịch bay hiện tại</p>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="date"
                className="h-8 w-36"
                value={viewRange.startDate}
                onChange={(e) => setViewRange((r) => ({ ...r, startDate: e.target.value }))}
              />
              <span className="text-xs text-muted-foreground">đến</span>
              <Input
                type="date"
                className="h-8 w-36"
                value={viewRange.endDate}
                onChange={(e) => setViewRange((r) => ({ ...r, endDate: e.target.value }))}
              />
            </div>
          </div>

          {isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-4 text-sm text-destructive">Không tải được dữ liệu lịch bay.</p>
          ) : !schedule || schedule.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Chưa thiết lập lịch bay cho khoảng ngày này.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày bay</TableHead>
                  <TableHead>Giờ đi</TableHead>
                  <TableHead>Giờ đến</TableHead>
                  <TableHead>Giá Economy</TableHead>
                  <TableHead>Giá Business</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.departureDate.slice(0, 10)}</TableCell>
                    <TableCell>{row.departureTime}</TableCell>
                    <TableCell>{row.arrivalTime}</TableCell>
                    <TableCell>{Number(row.economyPrice).toLocaleString("vi-VN")}</TableCell>
                    <TableCell>
                      {row.businessPrice ? Number(row.businessPrice).toLocaleString("vi-VN") : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
