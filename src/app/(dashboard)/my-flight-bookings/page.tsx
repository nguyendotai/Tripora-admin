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
import { useListMyProviderFlightBookingsQuery } from "@/features/flight-booking/api/flight-booking.api";
import { useListMyFlightsQuery } from "@/features/flight/api/flight.api";
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

export default function MyFlightBookingsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<StatusFilter>(undefined);
  const [flightId, setFlightId] = useState<string | undefined>(undefined);

  const { data: flights } = useListMyFlightsQuery();
  const { data: bookings, isLoading, isError } = useListMyProviderFlightBookingsQuery({
    status,
    flightId,
  });

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "FLIGHT")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Đặt vé của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Đơn đặt vé máy bay của tôi</p>
            <div className="flex flex-wrap items-center gap-3">
              {flights && flights.items.length > 1 && (
                <select
                  value={flightId ?? ""}
                  onChange={(e) => setFlightId(e.target.value || undefined)}
                  className="h-8 rounded-full border border-border bg-background px-3 text-xs"
                >
                  <option value="">Tất cả chuyến bay</option>
                  {flights.items.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.flightNumber} ({f.departureAirport?.code} → {f.arrivalAirport?.code})
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
              Không tải được danh sách đặt vé. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !bookings || bookings.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có đơn đặt vé nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Chuyến bay</TableHead>
                  <TableHead>Tuyến</TableHead>
                  <TableHead>Khách liên hệ</TableHead>
                  <TableHead>Ngày khởi hành</TableHead>
                  <TableHead>Số khách</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <p className="font-medium">
                        {[booking.user?.firstName, booking.user?.lastName].filter(Boolean).join(" ") ||
                          booking.user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.user?.email}</p>
                    </TableCell>
                    <TableCell className="font-medium">{booking.flightNumber}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {booking.departureAirportCode} → {booking.arrivalAirportCode}
                    </TableCell>
                    <TableCell>
                      <p>{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.customerEmail ?? booking.customerPhone ?? "—"}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(booking.departureDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {booking.numberOfPassengers}
                    </TableCell>
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
