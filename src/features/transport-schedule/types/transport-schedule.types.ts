export interface TransportSchedule {
  id: string;
  routeId: string;
  vehicleId: string;
  departureDate: string;
  capacity: number;
  available: number;
  booked: number;
  price?: string | null;
  createdAt: string;
  updatedAt: string;
}
