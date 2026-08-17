"use client";

import { FileText } from "lucide-react";
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
      <DialogContent className="sm:max-w-[864px]">
        <DialogHeader>
          <DialogTitle>Duyệt hồ sơ đối tác</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Tên doanh nghiệp</p>
            <p className="font-medium text-foreground">{provider?.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Người nộp</p>
            <p className="font-medium text-foreground">
              {applicantName || provider?.user?.email}
            </p>
            {applicantName && (
              <p className="text-muted-foreground">{provider?.user?.email}</p>
            )}
          </div>
          {provider?.contact && (
            <div>
              <p className="text-xs text-muted-foreground">Liên hệ</p>
              <p className="font-medium text-foreground">{provider.contact}</p>
            </div>
          )}
          {provider?.description && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Mô tả</p>
              <p className="text-muted-foreground">{provider.description}</p>
            </div>
          )}
          {provider?.documents && provider.documents.length > 0 && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Tài liệu kinh doanh</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {provider.documents.map((url, index) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Tài liệu {index + 1}
                  </a>
                ))}
              </div>
            </div>
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
