import type { PaginationMeta } from "@/features/destination/types/destination.types";

export interface Review {
  id: string;
  userId: string;
  destinationId: string;
  rating: number;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export interface PaginatedReviews {
  items: Review[];
  pagination: PaginationMeta;
}
