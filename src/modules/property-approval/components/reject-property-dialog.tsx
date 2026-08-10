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
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { type Property, useRejectPropertyMutation } from '@/features/property';

interface RejectPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
}

export function RejectPropertyDialog({ open, onOpenChange, property }: RejectPropertyDialogProps) {
  const [rejectProperty, { isLoading }] = useRejectPropertyMutation();
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!property) return;
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do từ chối.');
      return;
    }
    setError(null);
    try {
      await rejectProperty({ id: property.id, reason: reason.trim() }).unwrap();
      setReason('');
      onOpenChange(false);
    } catch {
      setError('Không thể từ chối Property. Thử lại sau.');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setError(null);
        if (!next) setReason('');
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Từ chối Property</DialogTitle>
          <DialogDescription>
            Từ chối &quot;{property?.name}&quot; — Partner sẽ thấy lý do này. Property chuyển sang trạng thái
            INACTIVE.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reason">Lý do từ chối</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Ví dụ: Thiếu ảnh minh hoạ, thông tin địa chỉ chưa rõ ràng..."
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button type="button" variant="destructive" disabled={isLoading} onClick={handleConfirm}>
            {isLoading ? 'Đang từ chối...' : 'Từ chối'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
