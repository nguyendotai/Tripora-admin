import type { BookingDomain } from "@/features/payment/types/payment.types";

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
  createdAt: string;
  provider: { name: string; type: string };
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
