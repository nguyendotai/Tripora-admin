export interface Destination {
  id: string;
  name: string;
  slug: string;
  country?: string | null;
  description?: string | null;
  images?: string[] | null;
  tags?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedDestinations {
  items: Destination[];
  pagination: PaginationMeta;
}
