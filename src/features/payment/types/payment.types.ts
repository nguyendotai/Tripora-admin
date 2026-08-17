export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export type BookingDomain = "HOTEL" | "TOUR" | "EXPERIENCE" | "TRANSPORT" | "FLIGHT";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  currency: string;
  status: "ISSUED";
  createdAt: string;
}

export interface Refund {
  id: string;
  amount: string;
  percent: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  processedAt?: string | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  bookingDomain: BookingDomain;
  bookingId: string;
  amount: string;
  discountAmount: string;
  currency: string;
  provider: string;
  method?: string | null;
  status: PaymentStatus;
  transactionId?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  invoice?: Invoice | null;
  refund?: Refund | null;
  user: { email: string };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedPayments {
  items: Payment[];
  pagination: PaginationMeta;
}
