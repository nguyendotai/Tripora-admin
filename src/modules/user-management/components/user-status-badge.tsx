import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/features/user/types/user.types";

const STATUS_STYLES: Record<UserStatus, string> = {
  ACTIVE: "bg-[#E6F7EC] text-[#16A34A] dark:bg-[#122B1B] dark:text-[#4ADE80]",
  INACTIVE: "bg-[#FFF3E0] text-[#B7791F] dark:bg-[#3A2A0F] dark:text-[#F5B94D]",
  BANNED: "bg-[#FDE9E9] text-[#DC2626] dark:bg-[#3A1518] dark:text-[#F87171]",
};

const STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Ngừng hoạt động",
  BANNED: "Đã cấm",
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge className={cn("rounded-full", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
