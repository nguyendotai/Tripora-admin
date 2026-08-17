import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrgMemberRole } from "@/features/organization-member/types/organization-member.types";

const ROLE_STYLES: Record<OrgMemberRole, string> = {
  OWNER: "bg-[#F1E9FE] text-[#7C3AED] dark:bg-[#241A3B] dark:text-[#B79CFB]",
  MANAGER: "bg-[#E7F0FF] text-[#2563EB] dark:bg-[#16233D] dark:text-[#7FADFF]",
  BOOKING_STAFF: "bg-[#E7F0FF] text-[#2563EB] dark:bg-[#16233D] dark:text-[#7FADFF]",
  FINANCE_STAFF: "bg-[#E7F0FF] text-[#2563EB] dark:bg-[#16233D] dark:text-[#7FADFF]",
};

const ROLE_LABELS: Record<OrgMemberRole, string> = {
  OWNER: "Chủ sở hữu",
  MANAGER: "Quản lý",
  BOOKING_STAFF: "Nhân viên đặt chỗ",
  FINANCE_STAFF: "Nhân viên tài chính",
};

export function MemberRoleBadge({ role }: { role: OrgMemberRole }) {
  return <Badge className={cn("rounded-full", ROLE_STYLES[role])}>{ROLE_LABELS[role]}</Badge>;
}
