import type { BookingDomain } from "@/features/payment/types/payment.types";
import type { DiscountType, PromoStatus } from "@/features/coupon/types/coupon.types";

export interface Promotion {
  id: string;
  providerId?: string | null;
  name: string;
  discountType: DiscountType;
  discountValue: string;
  maxDiscountAmount?: string | null;
  minOrderAmount: string;
  applicableDomains?: BookingDomain[] | null;
  priority: number;
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

export interface PaginatedPromotions {
  items: Promotion[];
  pagination: PaginationMeta;
}
