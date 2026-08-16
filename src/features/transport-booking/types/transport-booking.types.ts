export type TransportBookingStatus = "CONFIRMED" | "CANCELLED";

export interface TransportBooking {
  id: string;
  userId: string;
  routeId: string;
  vehicleId: string;
  routeOrigin: string;
  routeDestination: string;
  vehicleName: string;
  departureDate: string;
  numberOfPeople: number;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  totalPrice: string;
  currency: string;
  status: TransportBookingStatus;
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

export interface PaginatedTransportBookings {
  items: TransportBooking[];
  pagination: PaginationMeta;
}
