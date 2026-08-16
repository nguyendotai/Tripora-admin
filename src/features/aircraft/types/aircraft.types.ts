export type AircraftStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Aircraft {
  id: string;
  providerId: string;
  model: string;
  registrationCode: string;
  economyCapacity: number;
  businessCapacity: number;
  status: AircraftStatus;
  createdAt: string;
  updatedAt: string;
  provider?: { id: string; name: string; userId: string };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedAircraft {
  items: Aircraft[];
  pagination: PaginationMeta;
}
