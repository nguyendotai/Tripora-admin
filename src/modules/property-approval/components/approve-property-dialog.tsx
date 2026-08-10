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
import { type Property, useApprovePropertyMutation } from '@/features/property';

interface ApprovePropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
}

export function ApprovePropertyDialog({ open, onOpenChange, property }: ApprovePropertyDialogProps) {
  const [approveProperty, { isLoading }] = useApprovePropertyMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!property) return;
    setError(null);
    try {
      await approveProperty(property.id).unwrap();
      onOpenChange(false);
    } catch {
      setError('Không thể duyệt Property. Thử lại sau.');
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
          <DialogTitle>Duyệt Property</DialogTitle>
          <DialogDescription>
            Duyệt &quot;{property?.name}&quot; — Property sẽ chuyển sang ACTIVE và hiển thị công khai trên
            Frontend.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button type="button" disabled={isLoading} onClick={handleConfirm}>
            {isLoading ? 'Đang duyệt...' : 'Duyệt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
