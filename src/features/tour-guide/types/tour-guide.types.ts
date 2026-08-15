export type TourGuideStatus = "ACTIVE" | "INACTIVE";

export interface TourGuide {
  id: string;
  providerId: string;
  userId: string;
  bio?: string | null;
  phone?: string | null;
  status: TourGuideStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export interface MyGuideProfile {
  id: string;
  providerId: string;
  userId: string;
  bio?: string | null;
  phone?: string | null;
  status: TourGuideStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GuideAssignedSchedule {
  id: string;
  tourId: string;
  departureDate: string;
  capacity: number;
  available: number;
  booked: number;
  price?: string | null;
  guideId?: string | null;
  tour: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface GuideTraveler {
  id: string;
  userId: string;
  tourId: string;
  tourTitle: string;
  departureDate: string;
  numberOfPeople: number;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  totalPrice: string;
  currency: string;
  status: "CONFIRMED" | "CANCELLED";
}
