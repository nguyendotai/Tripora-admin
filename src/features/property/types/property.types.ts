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

export const PROPERTY_TYPES = ['HOTEL', 'RESORT', 'VILLA', 'APARTMENT', 'HOSTEL', 'HOMESTAY'] as const;
export type PropertyTypeValue = (typeof PROPERTY_TYPES)[number];

export interface CreatePropertyInput {
  destinationId: string;
  type: PropertyTypeValue;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
}

export type UpdatePropertyInput = Partial<CreatePropertyInput>;
