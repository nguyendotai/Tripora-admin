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
import {
  useAssignDriverMutation,
  useListMyDriversQuery,
} from "@/features/driver/api/driver.api";
import { useListMyProviderTransportBookingsQuery } from "@/features/transport-booking/api/transport-booking.api";
import { useListMyTransportRoutesQuery } from "@/features/transport-route/api/transport-route.api";
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

export default function MyTransportBookingsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<StatusFilter>(undefined);
  const [routeId, setRouteId] = useState<string | undefined>(undefined);

  const { data: routes } = useListMyTransportRoutesQuery();
  const { data: drivers } = useListMyDriversQuery();
  const [assignDriver] = useAssignDriverMutation();
  const { data: bookings, isLoading, isError } = useListMyProviderTransportBookingsQuery({
    status,
    routeId,
  });

  const handleDriverChange = (bookingId: string, driverId: string) => {
    assignDriver({ bookingId, driverId: driverId || undefined });
  };

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "TRANSPORT")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Đặt xe của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Đơn đặt xe của tôi</p>
            <div className="flex flex-wrap items-center gap-3">
              {routes && routes.items.length > 1 && (
                <select
                  value={routeId ?? ""}
                  onChange={(e) => setRouteId(e.target.value || undefined)}
                  className="h-8 rounded-full border border-border bg-background px-3 text-xs"
                >
                  <option value="">Tất cả tuyến</option>
                  {routes.items.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.origin} → {r.destination}
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
              Không tải được danh sách đặt xe. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !bookings || bookings.length === 0 ? (
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
                  <TableHead>Tài xế</TableHead>
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
                    <TableCell>
                      <select
                        value={booking.driverId ?? ""}
                        onChange={(e) => handleDriverChange(booking.id, e.target.value)}
                        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        <option value="">— Chưa phân công —</option>
                        {drivers?.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                      </select>
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
