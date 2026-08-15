import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/features/booking/types/booking.types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  CONFIRMED: "bg-[#E6F7EC] text-[#16A34A] dark:bg-[#122B1B] dark:text-[#4ADE80]",
  CANCELLED: "bg-[#FDE9E9] text-[#DC2626] dark:bg-[#3A1518] dark:text-[#F87171]",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã huỷ",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge className={cn("rounded-full", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
