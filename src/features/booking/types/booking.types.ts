export type BookingStatus = 'PENDING' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface BookingItem {
  id: string;
  resourceId: string;
  name: string;
  quantity: number;
  date: string;
  price: string;
  currency: string;
}

export interface BookingPayment {
  id: string;
  provider: string | null;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  amount: string;
  paidAt: string | null;
  createdAt: string;
}

export interface BookingRefund {
  id: string;
  amount: string;
  reason: string | null;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  partnerId: string;
  type: string;
  status: BookingStatus;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  items: BookingItem[];
  payments: BookingPayment[];
  refunds: BookingRefund[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}
