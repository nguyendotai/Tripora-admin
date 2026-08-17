import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PayoutStatus } from "@/features/commission/types/commission.types";

const STATUS_STYLES: Record<PayoutStatus, string> = {
  PENDING: "bg-[#FFF3E0] text-[#B7791F] dark:bg-[#3A2A0F] dark:text-[#F5B94D]",
  PAID: "bg-[#E6F7EC] text-[#16A34A] dark:bg-[#122B1B] dark:text-[#4ADE80]",
};

const STATUS_LABELS: Record<PayoutStatus, string> = {
  PENDING: "Chưa trả",
  PAID: "Đã trả",
};

export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  return <Badge className={cn("rounded-full", STATUS_STYLES[status])}>{STATUS_LABELS[status]}</Badge>;
}
