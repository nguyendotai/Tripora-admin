export type FlightScheduleStatus = "SCHEDULED" | "CANCELLED";

export interface FlightSchedule {
  id: string;
  flightId: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  economyPrice: string;
  businessPrice?: string | null;
  status: FlightScheduleStatus;
  createdAt: string;
  updatedAt: string;
}
