import type { PaginationMeta } from "@/features/destination/types/destination.types";

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  post?: {
    id: string;
    caption: string;
  };
}

export interface PaginatedComments {
  items: Comment[];
  pagination: PaginationMeta;
}
