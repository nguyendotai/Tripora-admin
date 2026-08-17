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
import { useCreateCouponMutation, useUpdateCouponMutation } from "@/features/coupon/api/coupon.api";
import type { Coupon } from "@/features/coupon/types/coupon.types";
import type { BookingDomain } from "@/features/payment/types/payment.types";
import { cn } from "@/lib/utils";

const DOMAIN_OPTIONS: { value: BookingDomain; label: string }[] = [
  { value: "HOTEL", label: "Khách sạn" },
  { value: "TOUR", label: "Tour" },
  { value: "EXPERIENCE", label: "Trải nghiệm" },
  { value: "TRANSPORT", label: "Vận chuyển" },
  { value: "FLIGHT", label: "Chuyến bay" },
];

const formSchema = z.object({
  code: z
    .string()
    .regex(/^[A-Za-z0-9_-]{3,30}$/, "Mã 3-30 ký tự chữ/số/-/_ (tự viết hoa khi lưu)"),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.string().min(1, "Vui lòng nhập giá trị giảm"),
  maxDiscountAmount: z.string().optional(),
  minOrderAmount: z.string().optional(),
  usageLimit: z.string().optional(),
  perUserLimit: z.string().optional(),
  validFrom: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  validUntil: z.string().min(1, "Vui lòng chọn ngày hết hạn"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  applicableDomains: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

function toDateInputValue(iso?: string) {
  return iso ? iso.slice(0, 10) : "";
}

export function CouponFormDialog({
  open,
  onOpenChange,
  coupon,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
}) {
  const isEdit = !!coupon;
  const [createCoupon, { isLoading: isCreating, error: createError }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating, error: updateError }] = useUpdateCouponMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });
  const domains = (watch("applicableDomains") ?? []) as BookingDomain[];

  useEffect(() => {
    if (open) {
      reset({
        code: coupon?.code ?? "",
        discountType: coupon?.discountType ?? "PERCENT",
        discountValue: coupon?.discountValue ?? "",
        maxDiscountAmount: coupon?.maxDiscountAmount ?? "",
        minOrderAmount: coupon?.minOrderAmount ?? "",
        usageLimit: coupon?.usageLimit != null ? String(coupon.usageLimit) : "",
        perUserLimit: coupon?.perUserLimit != null ? String(coupon.perUserLimit) : "",
        validFrom: toDateInputValue(coupon?.validFrom),
        validUntil: toDateInputValue(coupon?.validUntil),
        status: coupon?.status ?? "ACTIVE",
        applicableDomains: coupon?.applicableDomains ?? [],
      });
    }
  }, [open, coupon, reset]);

  const error = createError ?? updateError;
  const errorMessage =
    error && typeof error === "object" && "data" in error
      ? ((error.data as { message?: string })?.message ?? null)
      : null;

  const toggleDomain = (value: BookingDomain) => {
    setValue(
      "applicableDomains",
      domains.includes(value) ? domains.filter((d) => d !== value) : [...domains, value],
    );
  };

  const onSubmit = async (values: FormValues) => {
    const payload = {
      code: values.code.toUpperCase(),
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      maxDiscountAmount: values.maxDiscountAmount ? Number(values.maxDiscountAmount) : undefined,
      minOrderAmount: values.minOrderAmount ? Number(values.minOrderAmount) : undefined,
      applicableDomains: domains.length > 0 ? domains : undefined,
      usageLimit: values.usageLimit ? Number(values.usageLimit) : undefined,
      perUserLimit: values.perUserLimit ? Number(values.perUserLimit) : undefined,
      validFrom: new Date(`${values.validFrom}T00:00:00.000Z`).toISOString(),
      validUntil: new Date(`${values.validUntil}T23:59:59.000Z`).toISOString(),
      status: values.status,
    };

    if (isEdit && coupon) {
      await updateCoupon({ id: coupon.id, data: payload }).unwrap();
    } else {
      await createCoupon(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="code">Mã</Label>
              <Input id="code" placeholder="WELCOME10" className="uppercase" {...register("code")} />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discountType">Loại giảm giá</Label>
              <select
                id="discountType"
                {...register("discountType")}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="PERCENT">Phần trăm (%)</option>
                <option value="FIXED">Số tiền cố định (VND)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="discountValue">Giá trị giảm</Label>
              <Input id="discountValue" type="number" min={0} {...register("discountValue")} />
              {errors.discountValue && (
                <p className="text-xs text-destructive">{errors.discountValue.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maxDiscountAmount">Giảm tối đa (tuỳ chọn)</Label>
              <Input id="maxDiscountAmount" type="number" min={0} {...register("maxDiscountAmount")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="minOrderAmount">Đơn tối thiểu</Label>
              <Input id="minOrderAmount" type="number" min={0} {...register("minOrderAmount")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="usageLimit">Tổng lượt dùng</Label>
              <Input id="usageLimit" type="number" min={1} {...register("usageLimit")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="perUserLimit">Lượt/khách</Label>
              <Input id="perUserLimit" type="number" min={1} {...register("perUserLimit")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Áp dụng cho (bỏ trống = mọi loại đặt chỗ)</Label>
            <div className="flex flex-wrap gap-1.5">
              {DOMAIN_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleDomain(option.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    domains.includes(option.value)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="validFrom">Bắt đầu</Label>
              <Input id="validFrom" type="date" {...register("validFrom")} />
              {errors.validFrom && (
                <p className="text-xs text-destructive">{errors.validFrom.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="validUntil">Hết hạn</Label>
              <Input id="validUntil" type="date" {...register("validUntil")} />
              {errors.validUntil && (
                <p className="text-xs text-destructive">{errors.validUntil.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                {...register("status")}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngừng hoạt động</option>
              </select>
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
