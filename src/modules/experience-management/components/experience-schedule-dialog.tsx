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
  useListMyExperienceScheduleQuery,
  useSetExperienceScheduleMutation,
} from "@/features/experience-schedule/api/experience-schedule.api";
import type { Experience } from "@/features/experience/types/experience.types";

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
    capacity: z.string().min(1, "Nhập số chỗ"),
    price: z.string().optional(),
  })
  .refine((v) => v.startDate <= v.endDate, {
    message: "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof formSchema>;

export function ExperienceScheduleDialog({
  open,
  onOpenChange,
  experience,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: Experience | null;
}) {
  const [viewRange, setViewRange] = useState(defaultRange());

  useEffect(() => {
    if (open) {
      setViewRange(defaultRange());
    }
  }, [open]);

  const { data: schedule, isLoading, isError } = useListMyExperienceScheduleQuery(
    experience ? { experienceId: experience.id, ...viewRange } : { experienceId: "", startDate: "", endDate: "" },
    { skip: !open || !experience },
  );

  const [setExperienceSchedule, { isLoading: isSaving }] = useSetExperienceScheduleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (open) {
      reset({ ...defaultRange(), capacity: "10", price: "" });
    }
  }, [open, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!experience) return;
    await setExperienceSchedule({
      experienceId: experience.id,
      startDate: values.startDate,
      endDate: values.endDate,
      capacity: Number(values.capacity),
      price: values.price ? Number(values.price) : undefined,
    }).unwrap();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[1536px]">
        <DialogHeader>
          <DialogTitle>Ngày khởi hành — {experience?.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-1.5">
              <Label htmlFor="capacity">Số chỗ</Label>
              <Input id="capacity" type="number" min={0} {...register("capacity")} />
              {errors.capacity && (
                <p className="text-xs text-destructive">{errors.capacity.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Giá riêng (để trống = giá gốc)</Label>
              <Input id="price" type="number" min={0} {...register("price")} />
            </div>
          </div>

          <DialogFooter className="justify-start sm:justify-start">
            <Button type="submit" disabled={isSaving} className="rounded-full">
              {isSaving ? "Đang lưu..." : "Áp dụng cho khoảng ngày trên"}
            </Button>
          </DialogFooter>
        </form>

        <div className="rounded-[var(--radius-md)] border border-border">
          <div className="flex items-center justify-between gap-2 border-b border-border p-3">
            <p className="text-sm font-medium">Xem ngày khởi hành hiện tại</p>
            <div className="flex items-center gap-2">
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
            <p className="p-4 text-sm text-destructive">Không tải được dữ liệu ngày khởi hành.</p>
          ) : !schedule || schedule.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Chưa thiết lập ngày khởi hành cho khoảng ngày này.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày khởi hành</TableHead>
                  <TableHead>Tổng số chỗ</TableHead>
                  <TableHead>Còn trống</TableHead>
                  <TableHead>Đã đặt</TableHead>
                  <TableHead>Giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.departureDate.slice(0, 10)}</TableCell>
                    <TableCell>{row.capacity}</TableCell>
                    <TableCell>{row.available}</TableCell>
                    <TableCell>{row.booked}</TableCell>
                    <TableCell>{row.price ? Number(row.price).toLocaleString("vi-VN") : "—"}</TableCell>
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
