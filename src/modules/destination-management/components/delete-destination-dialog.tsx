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
import { type Destination, useDeleteDestinationMutation } from '@/features/destination';

interface DeleteDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: Destination | null;
}

export function DeleteDestinationDialog({ open, onOpenChange, destination }: DeleteDestinationDialogProps) {
  const [deleteDestination, { isLoading }] = useDeleteDestinationMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!destination) return;
    setError(null);
    try {
      await deleteDestination(destination.id).unwrap();
      onOpenChange(false);
    } catch {
      setError('Không thể xoá — điểm đến có thể còn Property/Product đang hoạt động.');
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
          <DialogTitle>Xoá điểm đến</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xoá &quot;{destination?.name}&quot;? Hành động này chỉ ẩn dữ liệu (soft delete),
            có thể khôi phục sau.
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
