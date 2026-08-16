import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DriverStatus } from "@/features/driver/types/driver.types";

const STATUS_STYLES: Record<DriverStatus, string> = {
  ACTIVE: "bg-[#E6F7EC] text-[#16A34A] dark:bg-[#122B1B] dark:text-[#4ADE80]",
  INACTIVE: "bg-[#FFF3E0] text-[#B7791F] dark:bg-[#3A2A0F] dark:text-[#F5B94D]",
};

const STATUS_LABELS: Record<DriverStatus, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  return <Badge className={cn("rounded-full", STATUS_STYLES[status])}>{STATUS_LABELS[status]}</Badge>;
}
