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
import { type Partner, useRejectPartnerMutation } from '@/features/partner';

interface RejectPartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner | null;
}

export function RejectPartnerDialog({ open, onOpenChange, partner }: RejectPartnerDialogProps) {
  const [rejectPartner, { isLoading }] = useRejectPartnerMutation();
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!partner) return;
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do từ chối.');
      return;
    }
    setError(null);
    try {
      await rejectPartner({ id: partner.id, reason: reason.trim() }).unwrap();
      setReason('');
      onOpenChange(false);
    } catch {
      setError('Không thể từ chối hồ sơ này.');
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
          <DialogTitle>Từ chối hồ sơ Partner</DialogTitle>
          <DialogDescription>
            Từ chối &quot;{partner?.businessName}&quot; — chủ hồ sơ sẽ thấy lý do này.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="partner-reject-reason">Lý do từ chối</Label>
          <Textarea
            id="partner-reject-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Ví dụ: Thiếu giấy phép kinh doanh, thông tin liên hệ chưa rõ ràng..."
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
