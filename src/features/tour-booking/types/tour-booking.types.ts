export type TourBookingStatus = "CONFIRMED" | "CANCELLED";

export interface TourBooking {
  id: string;
  userId: string;
  tourId: string;
  tourTitle: string;
  departureDate: string;
  numberOfPeople: number;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  totalPrice: string;
  currency: string;
  status: TourBookingStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTourBookings {
  items: TourBooking[];
  pagination: PaginationMeta;
}
