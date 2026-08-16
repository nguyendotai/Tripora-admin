export type TransportRouteStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface TransportRoute {
  id: string;
  providerId: string;
  origin: string;
  destination: string;
  vehicleType?: string | null;
  price: string;
  currency: string;
  estimatedDuration?: string | null;
  status: TransportRouteStatus;
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

export interface PaginatedTransportRoutes {
  items: TransportRoute[];
  pagination: PaginationMeta;
}
