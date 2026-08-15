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
import { useListMyProviderExperienceBookingsQuery } from "@/features/experience-booking/api/experience-booking.api";
import { useListMyExperiencesQuery } from "@/features/experience/api/experience.api";
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

export default function MyExperienceBookingsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<StatusFilter>(undefined);
  const [experienceId, setExperienceId] = useState<string | undefined>(undefined);

  const { data: experiences } = useListMyExperiencesQuery();
  const { data: bookings, isLoading, isError } = useListMyProviderExperienceBookingsQuery({
    status,
    experienceId,
  });

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "ACTIVITY")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  return (
    <>
      <Header title="Đặt experience của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
            <p className="font-semibold">Đơn đặt experience của tôi</p>
            <div className="flex flex-wrap items-center gap-3">
              {experiences && experiences.items.length > 1 && (
                <select
                  value={experienceId ?? ""}
                  onChange={(e) => setExperienceId(e.target.value || undefined)}
                  className="h-8 rounded-full border border-border bg-background px-3 text-xs"
                >
                  <option value="">Tất cả experience</option>
                  {experiences.items.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
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
              Không tải được danh sách đặt experience. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !bookings || bookings.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có đơn đặt experience nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Khách liên hệ</TableHead>
                  <TableHead>Ngày khởi hành</TableHead>
                  <TableHead>Số người</TableHead>
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
                    <TableCell className="font-medium">{booking.experienceTitle}</TableCell>
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
