'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  type RoomAvailability,
  type AvailabilityStatus,
  useUpdateRoomAvailabilityMutation,
} from '@/features/room-availability';

interface EditAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availability: RoomAvailability | null;
}

const STATUS_OPTIONS: { value: AvailabilityStatus; label: string }[] = [
  { value: 'AVAILABLE', label: 'Còn chỗ' },
  { value: 'SOLD_OUT', label: 'Hết chỗ' },
  { value: 'CLOSED', label: 'Đóng bán' },
];

export function EditAvailabilityDialog({ open, onOpenChange, availability }: EditAvailabilityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {/* key={availability.id} — remount khi đổi sang row khác, tự khởi tạo lại state từ props
            thay vì đồng bộ qua useEffect (cấm setState đồng bộ trong effect, xem react-hooks/set-state-in-effect). */}
        {availability && (
          <EditAvailabilityForm
            key={availability.id}
            availability={availability}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditAvailabilityForm({
  availability,
  onClose,
}: {
  availability: RoomAvailability;
  onClose: () => void;
}) {
  const [updateAvailability, { isLoading, error }] = useUpdateRoomAvailabilityMutation();
  const [total, setTotal] = useState(availability.total);
  const [price, setPrice] = useState(Number(availability.price));
  const [status, setStatus] = useState<AvailabilityStatus>(availability.status);

  const handleSubmit = async () => {
    await updateAvailability({ id: availability.id, body: { total, price, status } }).unwrap();
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sửa tồn kho ngày {availability.date.slice(0, 10)}</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-avail-total">Tổng số phòng</Label>
            <Input
              id="edit-avail-total"
              type="number"
              value={total}
              onChange={(event) => setTotal(Number(event.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-avail-price">Giá (đ/đêm)</Label>
            <Input
              id="edit-avail-price"
              type="number"
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-avail-status">Trạng thái</Label>
          <select
            id="edit-avail-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as AvailabilityStatus)}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-destructive">
            Không thể lưu — total không được nhỏ hơn số phòng đã đặt.
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button type="button" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </div>
    </>
  );
}
