export type FlightStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Flight {
  id: string;
  providerId: string;
  aircraftId: string;
  flightNumber: string;
  departureAirportId: string;
  arrivalAirportId: string;
  duration: number;
  status: FlightStatus;
  createdAt: string;
  updatedAt: string;
  provider?: { id: string; name: string; userId: string };
  aircraft?: { id: string; model: string; registrationCode: string };
  departureAirport?: { id: string; code: string; name: string; city: string };
  arrivalAirport?: { id: string; code: string; name: string; city: string };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedFlights {
  items: Flight[];
  pagination: PaginationMeta;
}
