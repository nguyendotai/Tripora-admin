import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExperienceStatus } from "@/features/experience/types/experience.types";

const STATUS_STYLES: Record<ExperienceStatus, string> = {
  PENDING: "bg-[#FFF3E0] text-[#B7791F] dark:bg-[#3A2A0F] dark:text-[#F5B94D]",
  APPROVED: "bg-[#E6F7EC] text-[#16A34A] dark:bg-[#122B1B] dark:text-[#4ADE80]",
  REJECTED: "bg-[#FDE9E9] text-[#DC2626] dark:bg-[#3A1518] dark:text-[#F87171]",
};

const STATUS_LABELS: Record<ExperienceStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Đã từ chối",
};

export function ExperienceStatusBadge({ status }: { status: ExperienceStatus }) {
  return (
    <Badge className={cn("rounded-full", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
