export interface TourItinerary {
  id: string;
  tourId: string;
  dayNumber: number;
  title: string;
  activities?: string | null;
  meals?: string | null;
  locations?: string | null;
  createdAt: string;
  updatedAt: string;
}
