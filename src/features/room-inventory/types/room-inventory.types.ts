export interface RoomInventory {
  id: string;
  roomId: string;
  date: string;
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  price?: string | null;
  createdAt: string;
  updatedAt: string;
}
