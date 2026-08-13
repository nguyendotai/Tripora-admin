export type PropertyStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Property {
  id: string;
  providerId: string;
  destinationId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  images?: string[] | null;
  amenities?: string[] | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  policies?: string | null;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
  destination?: { id: string; name: string; slug: string } | null;
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

export interface PaginatedProperties {
  items: Property[];
  pagination: PaginationMeta;
}
