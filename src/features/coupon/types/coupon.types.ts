import type { BookingDomain } from "@/features/payment/types/payment.types";

export type DiscountType = "PERCENT" | "FIXED";
export type PromoStatus = "ACTIVE" | "INACTIVE";

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: string;
  maxDiscountAmount?: string | null;
  minOrderAmount: string;
  applicableDomains?: BookingDomain[] | null;
  usageLimit?: number | null;
  usedCount: number;
  perUserLimit?: number | null;
  validFrom: string;
  validUntil: string;
  status: PromoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedCoupons {
  items: Coupon[];
  pagination: PaginationMeta;
}
