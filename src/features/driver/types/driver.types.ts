export type DriverStatus = "ACTIVE" | "INACTIVE";

export interface Driver {
  id: string;
  providerId: string;
  name: string;
  phone?: string | null;
  licenseNumber?: string | null;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
}
