"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListMyCommissionsQuery } from "@/features/commission/api/commission.api";
import type { BookingDomain } from "@/features/payment/types/payment.types";
import { PayoutStatusBadge } from "@/modules/commission-management/components/payout-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

const DOMAIN_LABELS: Record<BookingDomain, string> = {
  HOTEL: "Khách sạn",
  TOUR: "Tour",
  EXPERIENCE: "Trải nghiệm",
  TRANSPORT: "Vận chuyển",
  FLIGHT: "Chuyến bay",
};

function formatPrice(price: string) {
  return `${Number(price).toLocaleString("vi-VN")} VND`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

export default function MyCommissionsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyCommissionsQuery({ limit: 50 });

  useEffect(() => {
    if (
      user &&
      (!user.providerId || user.orgRole === "BOOKING_STAFF" || !user.orgRole)
    ) {
      router.replace("/my-properties");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Doanh thu của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Hoa hồng theo giao dịch</p>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được doanh thu. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có doanh thu nào</p>
              <p className="text-xs text-muted-foreground">
                Hoa hồng tự sinh 1 dòng cho mỗi giao dịch khách hàng thanh toán thành công.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Đặt chỗ</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Tỉ lệ</TableHead>
                  <TableHead>Platform nhận</TableHead>
                  <TableHead>Bạn nhận</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell className="text-muted-foreground">
                      {DOMAIN_LABELS[commission.bookingDomain]} #{commission.bookingId}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(commission.grossAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(Number(commission.rate) * 100).toFixed(0)}%
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(commission.platformAmount)}
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatPrice(commission.providerAmount)}
                    </TableCell>
                    <TableCell>
                      <PayoutStatusBadge status={commission.payoutStatus} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(commission.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </>
  );
}
