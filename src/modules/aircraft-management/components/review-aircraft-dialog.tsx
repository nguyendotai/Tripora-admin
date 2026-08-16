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
import { useReviewAircraftMutation } from "@/features/aircraft/api/aircraft.api";
import type { Aircraft } from "@/features/aircraft/types/aircraft.types";

export function ReviewAircraftDialog({
  open,
  onOpenChange,
  aircraft,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aircraft: Aircraft | null;
}) {
  const [reviewAircraft, { isLoading }] = useReviewAircraftMutation();
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
    if (!aircraft) return;
    await reviewAircraft({ id: aircraft.id, status: "APPROVED" }).unwrap();
    handleOpenChange(false);
  };

  const handleReject = async () => {
    if (!aircraft) return;
    await reviewAircraft({ id: aircraft.id, status: "REJECTED", reason: reason || undefined }).unwrap();
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duyệt máy bay</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Model: </span>
            <span className="font-medium text-foreground">{aircraft?.model}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Đối tác: </span>
            {aircraft?.provider?.name}
          </p>
          <p>
            <span className="text-muted-foreground">Số hiệu tàu bay: </span>
            {aircraft?.registrationCode}
          </p>
          <p>
            <span className="text-muted-foreground">Sức chứa: </span>
            {aircraft?.economyCapacity} Economy
            {aircraft && aircraft.businessCapacity > 0 ? ` + ${aircraft.businessCapacity} Business` : ""}
          </p>
        </div>

        {showRejectReason ? (
          <div className="space-y-1.5">
            <Label htmlFor="reason">Lý do từ chối (tuỳ chọn)</Label>
            <Textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ví dụ: Số hiệu tàu bay không hợp lệ"
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
