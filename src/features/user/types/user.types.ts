export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: "USER" | "ADMIN";
  status: UserStatus;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedUsers {
  items: User[];
  pagination: PaginationMeta;
}
