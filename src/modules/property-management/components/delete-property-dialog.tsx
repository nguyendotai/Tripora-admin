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
import { type Property, useDeletePropertyMutation } from '@/features/property';

interface DeletePropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
}

export function DeletePropertyDialog({ open, onOpenChange, property }: DeletePropertyDialogProps) {
  const [deleteProperty, { isLoading }] = useDeletePropertyMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!property) return;
    setError(null);
    try {
      await deleteProperty(property.id).unwrap();
      onOpenChange(false);
    } catch {
      setError('Không thể xoá — Property có thể còn Room đang hoạt động.');
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
          <DialogTitle>Xoá Property</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xoá &quot;{property?.name}&quot;? Hành động này chỉ ẩn dữ liệu (soft delete), có
            thể khôi phục sau.
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
