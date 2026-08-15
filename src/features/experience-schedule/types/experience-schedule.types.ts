export interface ExperienceSchedule {
  id: string;
  experienceId: string;
  departureDate: string;
  capacity: number;
  available: number;
  booked: number;
  price?: string | null;
  createdAt: string;
  updatedAt: string;
}
