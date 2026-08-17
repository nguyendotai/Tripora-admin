export type OrgMemberRole = "OWNER" | "MANAGER" | "BOOKING_STAFF" | "FINANCE_STAFF";

export interface OrganizationMember {
  id: string;
  providerId: string;
  userId: string;
  role: OrgMemberRole;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}
