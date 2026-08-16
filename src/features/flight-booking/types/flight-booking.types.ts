export type FlightBookingStatus = "CONFIRMED" | "CANCELLED";

export interface FlightBookingPassenger {
  id: string;
  seatId: string;
  fullName: string;
  idNumber: string;
}

export interface FlightBooking {
  id: string;
  userId: string;
  scheduleId: string;
  flightNumber: string;
  departureAirportCode: string;
  arrivalAirportCode: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  numberOfPassengers: number;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  totalPrice: string;
  currency: string;
  status: FlightBookingStatus;
  createdAt: string;
  updatedAt: string;
  passengers: FlightBookingPassenger[];
  user?: {
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

export interface PaginatedFlightBookings {
  items: FlightBooking[];
  pagination: PaginationMeta;
}
