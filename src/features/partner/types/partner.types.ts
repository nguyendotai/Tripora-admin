export type PartnerVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type PartnerBusinessType = 'HOTEL' | 'TOUR' | 'RESTAURANT' | 'VEHICLE';
export type PartnerStatus = 'ACTIVE' | 'SUSPENDED';

export interface Partner {
  id: string;
  ownerId: string;
  businessName: string;
  businessType: PartnerBusinessType;
  contactEmail: string | null;
  contactPhone: string | null;
  verificationStatus: PartnerVerificationStatus;
  verifiedAt: string | null;
  ratingAverage: string;
  ratingCount: number;
  status: PartnerStatus;
  createdAt: string;
  updatedAt: string;
}
