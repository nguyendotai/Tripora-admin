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
import type { BookingDomain } from "@/features/payment/types/payment.types";
import {
  useCreateMyPromotionMutation,
  useCreatePromotionMutation,
  useUpdateMyPromotionMutation,
  useUpdatePromotionMutation,
} from "@/features/promotion/api/promotion.api";
import type { Promotion } from "@/features/promotion/types/promotion.types";
import { cn } from "@/lib/utils";

const DOMAIN_OPTIONS: { value: BookingDomain; label: string }[] = [
  { value: "HOTEL", label: "Khách sạn" },
  { value: "TOUR", label: "Tour" },
  { value: "EXPERIENCE", label: "Trải nghiệm" },
  { value: "TRANSPORT", label: "Vận chuyển" },
  { value: "FLIGHT", label: "Chuyến bay" },
];

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên chương trình"),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.string().min(1, "Vui lòng nhập giá trị giảm"),
  maxDiscountAmount: z.string().optional(),
  minOrderAmount: z.string().optional(),
  priority: z.string().optional(),
  validFrom: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  validUntil: z.string().min(1, "Vui lòng chọn ngày hết hạn"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  applicableDomains: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

function toDateInputValue(iso?: string) {
  return iso ? iso.slice(0, 10) : "";
}

export function PromotionFormDialog({
  open,
  onOpenChange,
  promotion,
  mine = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion?: Promotion | null;
  /** true = Provider tu quan ly Promotion cua minh (/promotions/mine) — an muc chon domain vi
   * Backend tu gan theo ProviderType dang dang nhap (V7 vong 11). */
  mine?: boolean;
}) {
  const isEdit = !!promotion;
  const [createPromotion, { isLoading: isCreatingAdmin, error: createAdminError }] =
    useCreatePromotionMutation();
  const [updatePromotion, { isLoading: isUpdatingAdmin, error: updateAdminError }] =
    useUpdatePromotionMutation();
  const [createMyPromotion, { isLoading: isCreatingMine, error: createMineError }] =
    useCreateMyPromotionMutation();
  const [updateMyPromotion, { isLoading: isUpdatingMine, error: updateMineError }] =
    useUpdateMyPromotionMutation();
  const isLoading = mine
    ? isCreatingMine || isUpdatingMine
    : isCreatingAdmin || isUpdatingAdmin;
  const createError = mine ? createMineError : createAdminError;
  const updateError = mine ? updateMineError : updateAdminError;

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
        name: promotion?.name ?? "",
        discountType: promotion?.discountType ?? "PERCENT",
        discountValue: promotion?.discountValue ?? "",
        maxDiscountAmount: promotion?.maxDiscountAmount ?? "",
        minOrderAmount: promotion?.minOrderAmount ?? "",
        priority: promotion?.priority != null ? String(promotion.priority) : "0",
        validFrom: toDateInputValue(promotion?.validFrom),
        validUntil: toDateInputValue(promotion?.validUntil),
        status: promotion?.status ?? "ACTIVE",
        applicableDomains: promotion?.applicableDomains ?? [],
      });
    }
  }, [open, promotion, reset]);

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
      name: values.name,
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      maxDiscountAmount: values.maxDiscountAmount ? Number(values.maxDiscountAmount) : undefined,
      minOrderAmount: values.minOrderAmount ? Number(values.minOrderAmount) : undefined,
      ...(!mine && { applicableDomains: domains.length > 0 ? domains : undefined }),
      priority: values.priority ? Number(values.priority) : undefined,
      validFrom: new Date(`${values.validFrom}T00:00:00.000Z`).toISOString(),
      validUntil: new Date(`${values.validUntil}T23:59:59.000Z`).toISOString(),
      status: values.status,
    };

    if (mine) {
      if (isEdit && promotion) {
        await updateMyPromotion({ id: promotion.id, data: payload }).unwrap();
      } else {
        await createMyPromotion(payload).unwrap();
      }
    } else if (isEdit && promotion) {
      await updatePromotion({ id: promotion.id, data: payload }).unwrap();
    } else {
      await createPromotion(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Tên chương trình</Label>
            <Input id="name" placeholder="Giảm 5% mọi Tour tháng 9" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-1.5">
              <Label htmlFor="discountValue">Giá trị giảm</Label>
              <Input id="discountValue" type="number" min={0} {...register("discountValue")} />
              {errors.discountValue && (
                <p className="text-xs text-destructive">{errors.discountValue.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="maxDiscountAmount">Giảm tối đa</Label>
              <Input id="maxDiscountAmount" type="number" min={0} {...register("maxDiscountAmount")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="minOrderAmount">Đơn tối thiểu</Label>
              <Input id="minOrderAmount" type="number" min={0} {...register("minOrderAmount")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priority">Độ ưu tiên</Label>
              <Input id="priority" type="number" {...register("priority")} />
            </div>
          </div>

          {!mine && (
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
          )}

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
