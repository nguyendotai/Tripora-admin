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

/** V7 vòng 6 — GET /commissions/mine/summary, dùng cho trang Overview. */
export interface CommissionSummary {
  totalTransactions: number;
  totalEarned: string;
  totalPaid: string;
  totalPending: string;
}

/** V7 vòng 8 — GET /commissions/mine/analytics, 1 phần tử/1 ngày trong 30 ngày gần nhất. */
export interface CommissionAnalyticsPoint {
  date: string;
  totalRevenue: string;
  totalBookings: number;
}
