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
import { type Partner, useVerifyPartnerMutation } from '@/features/partner';

interface VerifyPartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner | null;
}

export function VerifyPartnerDialog({ open, onOpenChange, partner }: VerifyPartnerDialogProps) {
  const [verifyPartner, { isLoading }] = useVerifyPartnerMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!partner) return;
    setError(null);
    try {
      await verifyPartner(partner.id).unwrap();
      onOpenChange(false);
    } catch {
      setError('Không thể duyệt hồ sơ này.');
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
          <DialogTitle>Duyệt hồ sơ Partner</DialogTitle>
          <DialogDescription>
            Duyệt &quot;{partner?.businessName}&quot; — tài khoản sẽ được nâng lên quyền Partner và có thể
            đăng Property.
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
