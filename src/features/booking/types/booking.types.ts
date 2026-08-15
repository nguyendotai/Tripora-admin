export type BookingStatus = "CONFIRMED" | "CANCELLED";

export interface BookingGuest {
  id: string;
  bookingId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  propertyId: string;
  propertyName: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: string;
  currency: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  guests: BookingGuest[];
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

export interface PaginatedBookings {
  items: Booking[];
  pagination: PaginationMeta;
}
