export interface ActivityLogActor {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  actor: ActivityLogActor | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedActivityLogs {
  items: ActivityLog[];
  pagination: PaginationMeta;
}
