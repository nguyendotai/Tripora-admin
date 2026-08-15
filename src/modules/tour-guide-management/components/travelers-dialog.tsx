"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListScheduleTravelersQuery } from "@/features/tour-guide/api/tour-guide.api";
import type { GuideAssignedSchedule } from "@/features/tour-guide/types/tour-guide.types";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

export function TravelersDialog({
  open,
  onOpenChange,
  schedule,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: GuideAssignedSchedule | null;
}) {
  const { data: travelers, isLoading, isError } = useListScheduleTravelersQuery(schedule?.id ?? "", {
    skip: !open || !schedule,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[864px]">
        <DialogHeader>
          <DialogTitle>
            Danh sách khách — {schedule?.tour.title} ({schedule?.departureDate.slice(0, 10)})
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="p-4 text-sm text-muted-foreground">Đang tải...</p>
        ) : isError ? (
          <p className="p-4 text-sm text-destructive">Không tải được danh sách khách.</p>
        ) : !travelers || travelers.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Chưa có khách nào đặt chỗ ngày này.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách liên hệ</TableHead>
                <TableHead>Số người</TableHead>
                <TableHead>Tổng tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {travelers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <p className="font-medium">{t.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.customerEmail ?? t.customerPhone ?? "—"}
                    </p>
                  </TableCell>
                  <TableCell>{t.numberOfPeople}</TableCell>
                  <TableCell>{formatPrice(t.totalPrice, t.currency)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
