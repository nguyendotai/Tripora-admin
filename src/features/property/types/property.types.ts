export type PropertyStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE';

export interface Property {
  id: string;
  partnerId: string;
  destinationId: string;
  type: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  images: string[] | null;
  amenities: string[] | null;
  ratingAverage: string;
  ratingCount: number;
  checkInTime: string | null;
  checkOutTime: string | null;
  cancellationPolicy: string | null;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}
