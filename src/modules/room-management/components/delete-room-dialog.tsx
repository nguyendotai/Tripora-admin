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
import { type Room, useDeleteRoomMutation } from '@/features/room';

interface DeleteRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
}

export function DeleteRoomDialog({ open, onOpenChange, room }: DeleteRoomDialogProps) {
  const [deleteRoom, { isLoading }] = useDeleteRoomMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!room) return;
    setError(null);
    try {
      await deleteRoom(room.id).unwrap();
      onOpenChange(false);
    } catch {
      setError('Không thể xoá hạng phòng này.');
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
          <DialogTitle>Xoá hạng phòng</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xoá &quot;{room?.name}&quot;? Hành động này chỉ ẩn dữ liệu (soft delete).
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button type="button" variant="destructive" disabled={isLoading} onClick={handleConfirm}>
            {isLoading ? 'Đang xoá...' : 'Xoá'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
