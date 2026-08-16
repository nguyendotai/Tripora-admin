export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
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

export interface PaginatedAirports {
  items: Airport[];
  pagination: PaginationMeta;
}
