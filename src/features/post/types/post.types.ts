import type { PaginationMeta } from "@/features/destination/types/destination.types";

export interface Post {
  id: string;
  userId: string;
  destinationId?: string | null;
  caption: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  destination?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface PaginatedPosts {
  items: Post[];
  pagination: PaginationMeta;
}
