export interface ReportOverview {
  users: {
    total: number;
    active: number;
    inactive: number;
    banned: number;
    admins: number;
  };
  destinations: number;
  travelGuides: number;
  blogPosts: number;
  trips: number;
  reviews: {
    total: number;
    averageRating: number;
  };
  wishlistItems: number;
  topDestinationsByWishlist: {
    destination: { id: string; name: string; slug: string } | null;
    wishlistCount: number;
  }[];
}

export interface RevenueDayPoint {
  date: string;
  totalRevenue: string;
  totalBookings: number;
}

export type GeneratedReportStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface GeneratedReport {
  id: string;
  status: GeneratedReportStatus;
  data: ReportAnalytics | null;
  errorMessage?: string | null;
  requestedBy: string;
  createdAt: string;
  completedAt?: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedGeneratedReports {
  items: GeneratedReport[];
  pagination: PaginationMeta;
}

export interface ReportAnalytics {
  revenue: {
    total: string;
    totalTransactions: number;
    last30d: RevenueDayPoint[];
  };
  bookings: {
    total: number;
    byDomain: {
      HOTEL: number;
      TOUR: number;
      EXPERIENCE: number;
      TRANSPORT: number;
      FLIGHT: number;
    };
  };
  providers: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
  };
  users: ReportOverview["users"];
  conversion: {
    viewedUsers: number;
    convertedUsers: number;
    rate: number;
  };
}
