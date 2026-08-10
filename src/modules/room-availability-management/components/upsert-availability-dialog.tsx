'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  upsertAvailabilityFormSchema,
  type UpsertAvailabilityFormValues,
  useUpsertRoomAvailabilityMutation,
} from '@/features/room-availability';

interface UpsertAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
}

const EMPTY_VALUES: UpsertAvailabilityFormValues = { date: '', total: 1, price: 0 };

export function UpsertAvailabilityDialog({ open, onOpenChange, roomId }: UpsertAvailabilityDialogProps) {
  const [upsertAvailability, { isLoading, error }] = useUpsertRoomAvailabilityMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpsertAvailabilityFormValues>({
    resolver: zodResolver(upsertAvailabilityFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) reset(EMPTY_VALUES);
  }, [open, reset]);

  const onSubmit = async (values: UpsertAvailabilityFormValues) => {
    await upsertAvailability({ roomId, body: values }).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Thêm / cập nhật tồn kho theo ngày</DialogTitle>
          <DialogDescription>
            Nếu ngày đã có sẵn dữ liệu, tổng số phòng (total) và giá sẽ được cập nhật, số phòng đã đặt được
            giữ nguyên.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="avail-date">Ngày</Label>
            <Input id="avail-date" type="date" {...register('date')} />
            {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="avail-total">Tổng số phòng</Label>
              <Input id="avail-total" type="number" {...register('total', { valueAsNumber: true })} />
              {errors.total && <p className="text-xs text-destructive">{errors.total.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="avail-price">Giá (đ/đêm)</Label>
              <Input id="avail-price" type="number" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">Không thể lưu. Thử lại sau.</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
