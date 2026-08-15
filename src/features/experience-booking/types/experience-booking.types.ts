export type ExperienceBookingStatus = "CONFIRMED" | "CANCELLED";

export interface ExperienceBooking {
  id: string;
  userId: string;
  experienceId: string;
  experienceTitle: string;
  departureDate: string;
  numberOfPeople: number;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  totalPrice: string;
  currency: string;
  status: ExperienceBookingStatus;
  createdAt: string;
  updatedAt: string;
  user: {
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

export interface PaginatedExperienceBookings {
  items: ExperienceBooking[];
  pagination: PaginationMeta;
}
