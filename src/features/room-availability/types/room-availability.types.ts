export type AvailabilityStatus = 'AVAILABLE' | 'SOLD_OUT' | 'CLOSED';

export interface RoomAvailability {
  id: string;
  roomId: string;
  date: string;
  total: number;
  available: number;
  price: string;
  status: AvailabilityStatus;
}

export interface UpsertAvailabilityInput {
  date: string;
  total: number;
  price: number;
}

export interface UpdateAvailabilityInput {
  total?: number;
  price?: number;
  status?: AvailabilityStatus;
}
