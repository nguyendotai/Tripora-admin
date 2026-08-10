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
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  roomFormSchema,
  type RoomFormValues,
  type Room,
  useCreateRoomMutation,
  useUpdateRoomMutation,
} from '@/features/room';

interface RoomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  room?: Room | null;
}

const EMPTY_VALUES: RoomFormValues = {
  name: '',
  type: '',
  capacityAdults: 2,
  capacityChildren: 0,
  bedType: '',
  basePrice: 0,
  currency: 'VND',
};

export function RoomFormDialog({ open, onOpenChange, propertyId, room }: RoomFormDialogProps) {
  const isEdit = Boolean(room);
  const [createRoom, { isLoading: isCreating, error: createError }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating, error: updateError }] = useUpdateRoomMutation();
  const isSubmitting = isCreating || isUpdating;
  const submitError = createError || updateError;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(
        room
          ? {
              name: room.name,
              type: room.type ?? '',
              capacityAdults: room.capacityAdults,
              capacityChildren: room.capacityChildren,
              bedType: room.bedType ?? '',
              basePrice: Number(room.basePrice),
              currency: room.currency,
            }
          : EMPTY_VALUES,
      );
    }
  }, [open, room, reset]);

  const onSubmit = async (values: RoomFormValues) => {
    const body = {
      name: values.name,
      capacityAdults: values.capacityAdults,
      capacityChildren: values.capacityChildren,
      basePrice: values.basePrice,
      ...(values.type ? { type: values.type } : {}),
      ...(values.bedType ? { bedType: values.bedType } : {}),
      ...(values.currency ? { currency: values.currency } : {}),
    };

    if (isEdit && room) {
      await updateRoom({ id: room.id, body }).unwrap();
    } else {
      await createRoom({ propertyId, body }).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa hạng phòng' : 'Thêm hạng phòng'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="room-name">Tên hạng phòng</Label>
            <Input id="room-name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="room-adults">Số người lớn</Label>
              <Input id="room-adults" type="number" {...register('capacityAdults', { valueAsNumber: true })} />
              {errors.capacityAdults && (
                <p className="text-xs text-destructive">{errors.capacityAdults.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="room-children">Số trẻ em</Label>
              <Input id="room-children" type="number" {...register('capacityChildren', { valueAsNumber: true })} />
              {errors.capacityChildren && (
                <p className="text-xs text-destructive">{errors.capacityChildren.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="room-bedtype">Loại giường</Label>
              <Input id="room-bedtype" placeholder="King, Twin..." {...register('bedType')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="room-type">Loại phòng</Label>
              <Input id="room-type" placeholder="Deluxe, Suite..." {...register('type')} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="room-price">Giá cơ bản (đ/đêm)</Label>
            <Input id="room-price" type="number" {...register('basePrice', { valueAsNumber: true })} />
            {errors.basePrice && <p className="text-xs text-destructive">{errors.basePrice.message}</p>}
          </div>

          {submitError && <p className="text-sm text-destructive">Không thể lưu hạng phòng. Thử lại sau.</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
