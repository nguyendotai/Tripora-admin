import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VehicleStatus } from "@/features/vehicle/types/vehicle.types";

const STATUS_STYLES: Record<VehicleStatus, string> = {
  PENDING: "bg-[#FFF3E0] text-[#B7791F] dark:bg-[#3A2A0F] dark:text-[#F5B94D]",
  APPROVED: "bg-[#E6F7EC] text-[#16A34A] dark:bg-[#122B1B] dark:text-[#4ADE80]",
  REJECTED: "bg-[#FDE9E9] text-[#DC2626] dark:bg-[#3A1518] dark:text-[#F87171]",
};

const STATUS_LABELS: Record<VehicleStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Đã từ chối",
};

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <Badge className={cn("rounded-full", STATUS_STYLES[status])}>{STATUS_LABELS[status]}</Badge>
  );
}
