"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListAllPaymentsQuery } from "@/features/payment/api/payment.api";
import type { BookingDomain, PaymentStatus } from "@/features/payment/types/payment.types";
import { cn } from "@/lib/utils";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

const DOMAIN_LABELS: Record<BookingDomain, string> = {
  HOTEL: "Khách sạn",
  TOUR: "Tour",
  EXPERIENCE: "Trải nghiệm",
  TRANSPORT: "Vận chuyển",
  FLIGHT: "Chuyến bay",
};

const FILTERS: { label: string; value: PaymentStatus | undefined }[] = [
  { label: "Tất cả", value: undefined },
  { label: "Thành công", value: "SUCCESS" },
  { label: "Đang chờ", value: "PENDING" },
  { label: "Thất bại", value: "FAILED" },
];

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  if (status === "SUCCESS") return <Badge variant="default">Thành công</Badge>;
  if (status === "FAILED") return <Badge variant="destructive">Thất bại</Badge>;
  return <Badge variant="secondary">Đang chờ</Badge>;
}

export default function PaymentsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<PaymentStatus | undefined>(undefined);
  const { data, isLoading, isError } = useListAllPaymentsQuery({ status, limit: 50 });

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/my-properties");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Thanh toán" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Toàn bộ giao dịch (Payment / Invoice / Refund)</p>
            <div className="flex gap-1.5">
              {FILTERS.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setStatus(filter.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    status === filter.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách giao dịch. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có giao dịch nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Đặt chỗ</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Hoá đơn</TableHead>
                  <TableHead>Hoàn tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-muted-foreground">{payment.user.email}</TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {DOMAIN_LABELS[payment.bookingDomain]} #{payment.bookingId}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-primary">
                        {formatPrice(payment.amount, payment.currency)}
                      </p>
                      {Number(payment.discountAmount) > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Đã giảm {formatPrice(payment.discountAmount, payment.currency)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.invoice?.invoiceNumber ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.refund
                        ? `${formatPrice(payment.refund.amount, payment.currency)} (${payment.refund.percent}%)`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(payment.createdAt)}
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
