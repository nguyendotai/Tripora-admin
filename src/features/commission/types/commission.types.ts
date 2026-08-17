import type { BookingDomain } from "@/features/payment/types/payment.types";

export type PayoutStatus = "PENDING" | "PAID";

export interface Commission {
  id: string;
  providerId: string;
  paymentId: string;
  bookingDomain: BookingDomain;
  bookingId: string;
  grossAmount: string;
  rate: string;
  platformAmount: string;
  providerAmount: string;
  payoutStatus: PayoutStatus;
  paidAt?: string | null;
  createdAt: string;
  /** Chỉ có ở `GET /commissions` (Admin, xem toàn hệ thống) — `GET /commissions/mine` (Provider) không kèm vì đã biết là chính mình. */
  provider?: { name: string; type: string };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedCommissions {
  items: Commission[];
  pagination: PaginationMeta;
}
