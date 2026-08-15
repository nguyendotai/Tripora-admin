export type TourStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Tour {
  id: string;
  providerId: string;
  destinationId?: string | null;
  title: string;
  slug: string;
  description?: string | null;
  images?: string[] | null;
  durationLabel?: string | null;
  price: string;
  currency: string;
  maxParticipants?: number | null;
  included?: string | null;
  excluded?: string | null;
  cancellationPolicy?: string | null;
  status: TourStatus;
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

export interface PaginatedTours {
  items: Tour[];
  pagination: PaginationMeta;
}
