"use client";

import { CheckCircle2, CircleDollarSign, Clock, Receipt } from "lucide-react";
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
import {
  useGetMySummaryQuery,
  useListMyCommissionsQuery,
} from "@/features/commission/api/commission.api";
import type { BookingDomain } from "@/features/payment/types/payment.types";
import { PayoutStatusBadge } from "@/modules/commission-management/components/payout-status-badge";
import { StatCard } from "@/modules/dashboard/components/stat-card";
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

export default function MyOverviewPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: summary, isLoading: isLoadingSummary, isError: isSummaryError } =
    useGetMySummaryQuery();
  const { data: recent, isLoading: isLoadingRecent } = useListMyCommissionsQuery({
    limit: 5,
  });

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
      <Header title="Tổng quan" />

      <main className="p-6">
        {isSummaryError ? (
          <p className="text-sm text-destructive">
            Không tải được số liệu tổng quan. Kiểm tra Backend/kết nối MySQL.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Receipt}
              label="Tổng giao dịch"
              value={isLoadingSummary ? "..." : (summary?.totalTransactions ?? 0)}
            />
            <StatCard
              icon={CircleDollarSign}
              label="Tổng doanh thu"
              value={isLoadingSummary ? "..." : formatPrice(summary?.totalEarned ?? "0")}
            />
            <StatCard
              icon={CheckCircle2}
              label="Đã nhận"
              value={isLoadingSummary ? "..." : formatPrice(summary?.totalPaid ?? "0")}
            />
            <StatCard
              icon={Clock}
              label="Chờ thanh toán"
              value={isLoadingSummary ? "..." : formatPrice(summary?.totalPending ?? "0")}
            />
          </div>
        )}

        <div className="mt-4 rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="border-b border-border p-4">
            <p className="font-semibold">Hoạt động gần đây</p>
          </div>

          {isLoadingRecent ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : !recent || recent.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có giao dịch nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Đặt chỗ</TableHead>
                  <TableHead>Bạn nhận</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.items.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell className="text-muted-foreground">
                      {DOMAIN_LABELS[commission.bookingDomain]} #{commission.bookingId}
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
