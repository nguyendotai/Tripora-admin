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
