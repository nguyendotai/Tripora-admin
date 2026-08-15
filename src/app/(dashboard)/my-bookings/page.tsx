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
import { useListMyProviderBookingsQuery } from "@/features/booking/api/booking.api";
import { useListMyPropertiesQuery } from "@/features/property/api/property.api";
import { BookingStatusBadge } from "@/modules/booking-management/components/booking-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";
import { cn } from "@/lib/utils";

type StatusFilter = "upcoming" | "completed" | "cancelled" | undefined;

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "Tất cả", value: undefined },
  { label: "Sắp tới", value: "upcoming" },
  { label: "Đã hoàn thành", value: "completed" },
  { label: "Đã huỷ", value: "cancelled" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<StatusFilter>(undefined);
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);

  const { data: properties } = useListMyPropertiesQuery();
  const { data: bookings, isLoading, isError } = useListMyProviderBookingsQuery({
    status,
    propertyId,
  });

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "HOTEL")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Đặt phòng của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Đơn đặt phòng tại khách sạn của tôi</p>
            <div className="flex flex-wrap items-center gap-3">
              {properties && properties.items.length > 1 && (
                <select
                  value={propertyId ?? ""}
                  onChange={(e) => setPropertyId(e.target.value || undefined)}
                  className="h-8 rounded-full border border-border bg-background px-3 text-xs"
                >
                  <option value="">Tất cả khách sạn</option>
                  {properties.items.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
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
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách đặt phòng. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !bookings || bookings.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có đơn đặt phòng nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Khách sạn / Phòng</TableHead>
                  <TableHead>Nhận / Trả phòng</TableHead>
                  <TableHead>Số đêm</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <p className="font-medium">
                        {[booking.user.firstName, booking.user.lastName].filter(Boolean).join(" ") ||
                          booking.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.user.email}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{booking.propertyName}</p>
                      <p className="text-xs text-muted-foreground">{booking.roomName}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(booking.checkInDate)} — {formatDate(booking.checkOutDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{booking.nights}</TableCell>
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
