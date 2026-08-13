export type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Provider {
  id: string;
  userId: string;
  type: "HOTEL" | "TOUR" | "ACTIVITY" | "TRANSPORT" | "FLIGHT";
  name: string;
  description?: string | null;
  logo?: string | null;
  contact?: string | null;
  status: ProviderStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
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

export interface PaginatedProviders {
  items: Provider[];
  pagination: PaginationMeta;
}
