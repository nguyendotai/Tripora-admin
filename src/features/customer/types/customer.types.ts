/** V7 vòng 7 — GET .../provider/customers (5 domain, cùng shape response). */
export interface ProviderCustomer {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  totalBookings: number;
  totalSpent: string;
  lastBookingAt: string;
}
