'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { type Booking, useCancelBookingMutation } from '@/features/booking';

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
}

export function CancelBookingDialog({ open, onOpenChange, booking }: CancelBookingDialogProps) {
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!booking) return;
    setError(null);
    try {
      await cancelBooking(booking.id).unwrap();
      onOpenChange(false);
    } catch {
      setError('Không thể hủy Booking này.');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setError(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Hủy Booking</DialogTitle>
          <DialogDescription>
            Hủy đơn &quot;{booking?.bookingCode}&quot;? Nếu đã thanh toán, hệ thống sẽ tự tạo yêu cầu hoàn
            tiền theo chính sách hủy. Tồn kho sẽ được hoàn lại ngay.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button type="button" variant="destructive" disabled={isLoading} onClick={handleConfirm}>
            {isLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
