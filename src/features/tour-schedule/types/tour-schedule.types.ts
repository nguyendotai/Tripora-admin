export interface TourSchedule {
  id: string;
  tourId: string;
  departureDate: string;
  capacity: number;
  available: number;
  booked: number;
  price?: string | null;
  guideId?: string | null;
  createdAt: string;
  updatedAt: string;
}
