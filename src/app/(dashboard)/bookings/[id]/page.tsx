'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { Button } from '@/shared/components/ui/button';
import { type BookingStatus, useGetBookingQuery } from '@/features/booking';
import { CancelBookingDialog } from '@/modules/booking-management/components/cancel-booking-dialog';

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Chờ xử lý',
  PAYMENT_PENDING: 'Chờ thanh toán',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REFUNDED: 'Đã hoàn tiền',
};

const CANCELLABLE: BookingStatus[] = ['PENDING', 'PAYMENT_PENDING', 'CONFIRMED'];

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminBookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = use(params);
  const { data: booking, isLoading, isError } = useGetBookingQuery(id);
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <Link href="/bookings" className="text-xs text-muted-foreground hover:text-foreground">
            ← Bookings
          </Link>
          <h1 className="text-lg font-bold">{booking ? `Booking ${booking.bookingCode}` : 'Chi tiết Booking'}</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col gap-4 p-6">
        {isLoading && <p className="text-center text-muted-foreground">Đang tải...</p>}
        {isError && <p className="text-center text-destructive">Không thể tải Booking này.</p>}

        {booking && (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Thông tin chung</h2>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Khách</dt>
                <dd>{booking.guestName ?? '—'}</dd>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{booking.guestEmail ?? '—'}</dd>
                <dt className="text-muted-foreground">SĐT</dt>
                <dd>{booking.guestPhone ?? '—'}</dd>
                <dt className="text-muted-foreground">Thanh toán</dt>
                <dd>{booking.paymentStatus}</dd>
                <dt className="text-muted-foreground">Ngày tạo</dt>
                <dd>{new Date(booking.createdAt).toLocaleString('vi-VN')}</dd>
              </dl>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <h2 className="font-semibold">Chi tiết phòng</h2>
              <div className="mt-3 flex flex-col gap-2">
                {booking.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} — {new Date(item.date).toLocaleDateString('vi-VN')} × {item.quantity}
                    </span>
                    <span>{Number(item.price).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary">{Number(booking.total).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {booking.payments.length > 0 && (
              <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
                <h2 className="font-semibold">Thanh toán</h2>
                {booking.payments.map((payment) => (
                  <div key={payment.id} className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {payment.provider ?? '—'} · {payment.status}
                    </span>
                    <span>{Number(payment.amount).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
            )}

            {booking.refunds.length > 0 && (
              <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
                <h2 className="font-semibold">Hoàn tiền</h2>
                {booking.refunds.map((refund) => (
                  <div key={refund.id} className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{refund.status}</span>
                    <span>{Number(refund.amount).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
            )}

            {CANCELLABLE.includes(booking.status) && (
              <div className="flex justify-end">
                <Button variant="destructive" onClick={() => setCancelOpen(true)}>
                  Hủy Booking
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <CancelBookingDialog open={cancelOpen} onOpenChange={setCancelOpen} booking={booking ?? null} />
    </>
  );
}
