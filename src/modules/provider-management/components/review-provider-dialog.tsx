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
import { useReviewProviderMutation } from "@/features/provider/api/provider.api";
import type { Provider } from "@/features/provider/types/provider.types";

export function ReviewProviderDialog({
  open,
  onOpenChange,
  provider,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider | null;
}) {
  const [reviewProvider, { isLoading }] = useReviewProviderMutation();
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [reason, setReason] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setShowRejectReason(false);
      setReason("");
    }
    onOpenChange(next);
  };

  const handleApprove = async () => {
    if (!provider) return;
    await reviewProvider({ id: provider.id, status: "APPROVED" }).unwrap();
    handleOpenChange(false);
  };

  const handleReject = async () => {
    if (!provider) return;
    await reviewProvider({ id: provider.id, status: "REJECTED", reason: reason || undefined }).unwrap();
    handleOpenChange(false);
  };

  const applicantName = [provider?.user?.firstName, provider?.user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duyệt hồ sơ đối tác</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Tên doanh nghiệp: </span>
            <span className="font-medium text-foreground">{provider?.name}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Người nộp: </span>
            {applicantName || provider?.user?.email} ({provider?.user?.email})
          </p>
          {provider?.contact && (
            <p>
              <span className="text-muted-foreground">Liên hệ: </span>
              {provider.contact}
            </p>
          )}
          {provider?.description && (
            <p className="text-muted-foreground">{provider.description}</p>
          )}
        </div>

        {showRejectReason ? (
          <div className="space-y-1.5">
            <Label htmlFor="reason">Lý do từ chối (tuỳ chọn)</Label>
            <Textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ví dụ: Thiếu giấy phép kinh doanh hợp lệ"
            />
          </div>
        ) : null}

        <DialogFooter>
          {showRejectReason ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setShowRejectReason(false)}
              >
                Quay lại
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isLoading}
                className="rounded-full"
                onClick={handleReject}
              >
                {isLoading ? "Đang gửi..." : "Xác nhận từ chối"}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="destructive"
                disabled={isLoading}
                className="rounded-full"
                onClick={() => setShowRejectReason(true)}
              >
                Từ chối
              </Button>
              <Button type="button" disabled={isLoading} className="rounded-full" onClick={handleApprove}>
                {isLoading ? "Đang duyệt..." : "Duyệt"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
