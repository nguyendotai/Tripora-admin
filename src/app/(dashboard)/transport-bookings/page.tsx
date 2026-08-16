"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListAllTransportBookingsQuery } from "@/features/transport-booking/api/transport-booking.api";
import type { TransportBookingStatus } from "@/features/transport-booking/types/transport-booking.types";
import { BookingStatusBadge } from "@/modules/booking-management/components/booking-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: TransportBookingStatus | undefined }[] = [
  { label: "Tất cả", value: undefined },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

export default function TransportBookingsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<TransportBookingStatus | undefined>(undefined);
  const { data, isLoading, isError } = useListAllTransportBookingsQuery({ status, limit: 50 });

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace(getProviderHomePath(user.providerType));
    }
  }, [user, router]);

  return (
    <>
      <Header title="Đặt xe" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Toàn bộ đơn đặt xe</p>
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
              Không tải được danh sách đặt xe. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có đơn đặt xe nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Tuyến</TableHead>
                  <TableHead>Xe</TableHead>
                  <TableHead>Khách liên hệ</TableHead>
                  <TableHead>Ngày khởi hành</TableHead>
                  <TableHead>Số người</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <p className="font-medium">
                        {[booking.user.firstName, booking.user.lastName].filter(Boolean).join(" ") ||
                          booking.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.user.email}</p>
                    </TableCell>
                    <TableCell className="font-medium">
                      {booking.routeOrigin} → {booking.routeDestination}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{booking.vehicleName}</TableCell>
                    <TableCell>
                      <p>{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.customerEmail ?? booking.customerPhone ?? "—"}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(booking.departureDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{booking.numberOfPeople}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(booking.totalPrice, booking.currency)}
                    </TableCell>
                    <TableCell>
                      <BookingStatusBadge status={booking.status} />
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
