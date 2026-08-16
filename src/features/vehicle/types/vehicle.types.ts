export type VehicleStatus = "PENDING" | "APPROVED" | "REJECTED";
export type VehicleType = "CAR" | "SUV" | "VAN" | "BUS" | "MOTORBIKE";

export interface Vehicle {
  id: string;
  providerId: string;
  type: VehicleType;
  name: string;
  model?: string | null;
  capacity: number;
  features?: string[] | null;
  licensePlate: string;
  images?: string[] | null;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
  provider?: { id: string; name: string; userId: string };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedVehicles {
  items: Vehicle[];
  pagination: PaginationMeta;
}
