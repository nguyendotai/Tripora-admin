'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Ban, Eye } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { type Booking, type BookingStatus, useListAllBookingsQuery } from '@/features/booking';
import { CancelBookingDialog } from '@/modules/booking-management/components/cancel-booking-dialog';

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Chờ xử lý',
  PAYMENT_PENDING: 'Chờ thanh toán',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REFUNDED: 'Đã hoàn tiền',
};

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: 'bg-[#FFF3E0] text-[#B7791F] dark:bg-[#3A2A0F] dark:text-[#F5B94D]',
  PAYMENT_PENDING: 'bg-[#FFF3E0] text-[#B7791F] dark:bg-[#3A2A0F] dark:text-[#F5B94D]',
  CONFIRMED: 'bg-[#E6F7EC] text-[#16A34A] dark:bg-[#122B1B] dark:text-[#4ADE80]',
  COMPLETED: 'bg-[#E6F7EC] text-[#16A34A] dark:bg-[#122B1B] dark:text-[#4ADE80]',
  CANCELLED: 'bg-[#FDE9E9] text-[#DC2626] dark:bg-[#3A1518] dark:text-[#F87171]',
  REFUNDED: 'bg-[#E7F0FF] text-[#2563EB] dark:bg-[#16233D] dark:text-[#7FADFF]',
};

const CANCELLABLE: BookingStatus[] = ['PENDING', 'PAYMENT_PENDING', 'CONFIRMED'];

const STATUS_FILTERS: { value: BookingStatus | ''; label: string }[] = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'PAYMENT_PENDING', label: 'Chờ thanh toán' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền' },
];

export default function BookingsPage() {
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const { data, isLoading, isError } = useListAllBookingsQuery({ status: status || undefined });
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  return (
    <>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-bold">Bookings</h1>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as BookingStatus | '')}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-56"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Booking</TableHead>
                <TableHead>Khách</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-24 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    Đang tải...
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-destructive">
                    Không thể tải danh sách Booking.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    Chưa có Booking nào.
                  </TableCell>
                </TableRow>
              )}

              {data?.items.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.bookingCode}</TableCell>
                  <TableCell className="text-muted-foreground">{booking.guestName ?? booking.guestEmail ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {Number(booking.total).toLocaleString('vi-VN')}đ
                  </TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[booking.status]}`}>
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/bookings/${booking.id}`}
                        className="inline-flex size-8 items-center justify-center rounded-md hover:bg-secondary"
                        aria-label="Xem chi tiết"
                      >
                        <Eye className="size-4" />
                      </Link>
                      {CANCELLABLE.includes(booking.status) && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Hủy"
                          onClick={() => setCancellingBooking(booking)}
                        >
                          <Ban className="size-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data && data.pagination.totalItems > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            {data.pagination.totalItems} Booking — Trang {data.pagination.page}/{data.pagination.totalPages}
          </p>
        )}
      </main>

      <CancelBookingDialog
        open={Boolean(cancellingBooking)}
        onOpenChange={(open) => !open && setCancellingBooking(null)}
        booking={cancellingBooking}
      />
    </>
  );
}
