"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useSuspendProviderMutation,
  useUnsuspendProviderMutation,
} from "@/features/provider/api/provider.api";
import type { Provider } from "@/features/provider/types/provider.types";

export function SuspendProviderDialog({
  open,
  onOpenChange,
  provider,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider | null;
}) {
  const [suspendProvider, { isLoading: isSuspending }] = useSuspendProviderMutation();
  const [unsuspendProvider, { isLoading: isUnsuspending }] = useUnsuspendProviderMutation();
  const [reason, setReason] = useState("");

  const isSuspended = provider?.status === "SUSPENDED";

  const handleOpenChange = (next: boolean) => {
    if (!next) setReason("");
    onOpenChange(next);
  };

  const handleConfirm = async () => {
    if (!provider) return;
    if (isSuspended) {
      await unsuspendProvider({ id: provider.id }).unwrap();
    } else {
      await suspendProvider({ id: provider.id, reason: reason || undefined }).unwrap();
    }
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isSuspended ? "Mở khoá đối tác" : "Khoá đối tác"}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {isSuspended ? (
            <>
              Mở khoá lại cho{" "}
              <span className="font-medium text-foreground">{provider?.name}</span>? Đối tác sẽ
              tiếp tục quản lý khách sạn và nhận đặt phòng như bình thường.
            </>
          ) : (
            <>
              Khoá <span className="font-medium text-foreground">{provider?.name}</span>? Đối tác
              sẽ không thể tạo/sửa khách sạn, phòng, tồn kho, hoặc đăng nhập vào hệ thống quản trị
              cho tới khi được mở khoá lại.
            </>
          )}
        </p>

        {!isSuspended && (
          <div className="space-y-1.5">
            <Label htmlFor="suspend-reason">Lý do khoá (tuỳ chọn)</Label>
            <Textarea
              id="suspend-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ví dụ: Vi phạm chính sách đặt phòng"
            />
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => handleOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button
            type="button"
            variant={isSuspended ? "default" : "destructive"}
            disabled={isSuspending || isUnsuspending}
            className="rounded-full"
            onClick={handleConfirm}
          >
            {isSuspending || isUnsuspending
              ? "Đang xử lý..."
              : isSuspended
                ? "Mở khoá"
                : "Khoá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
