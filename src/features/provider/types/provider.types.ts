export type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export type OrgMemberRole = "OWNER" | "MANAGER" | "BOOKING_STAFF" | "FINANCE_STAFF";

export interface Provider {
  id: string;
  userId: string;
  type: "HOTEL" | "TOUR" | "ACTIVITY" | "TRANSPORT" | "FLIGHT";
  name: string;
  description?: string | null;
  logo?: string | null;
  contact?: string | null;
  documents?: string[] | null;
  status: ProviderStatus;
  createdAt: string;
  updatedAt: string;
  /** V7 vòng 1 — chỉ có khi đã là thành viên tổ chức (Owner từ lúc được duyệt, hoặc mời sau). */
  role?: OrgMemberRole;
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
