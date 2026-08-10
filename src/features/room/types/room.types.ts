export type RoomStatus = 'ACTIVE' | 'INACTIVE';

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  type: string | null;
  capacityAdults: number;
  capacityChildren: number;
  bedType: string | null;
  amenities: string[] | null;
  images: string[] | null;
  basePrice: string;
  currency: string;
  status: RoomStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomInput {
  name: string;
  type?: string;
  capacityAdults?: number;
  capacityChildren?: number;
  bedType?: string;
  basePrice: number;
  currency?: string;
}

export interface UpdateRoomInput extends Partial<CreateRoomInput> {
  status?: RoomStatus;
}
