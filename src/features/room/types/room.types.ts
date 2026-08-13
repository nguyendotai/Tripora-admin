export type RoomStatus = "ACTIVE" | "INACTIVE";

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  description?: string | null;
  capacity?: number | null;
  beds?: string[] | null;
  basePrice: string;
  currency: string;
  amenities?: string[] | null;
  images?: string[] | null;
  status: RoomStatus;
  createdAt: string;
  updatedAt: string;
}
