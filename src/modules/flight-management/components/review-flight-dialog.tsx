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
import { useReviewFlightMutation } from "@/features/flight/api/flight.api";
import type { Flight } from "@/features/flight/types/flight.types";

export function ReviewFlightDialog({
  open,
  onOpenChange,
  flight,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flight: Flight | null;
}) {
  const [reviewFlight, { isLoading }] = useReviewFlightMutation();
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
    if (!flight) return;
    await reviewFlight({ id: flight.id, status: "APPROVED" }).unwrap();
    handleOpenChange(false);
  };

  const handleReject = async () => {
    if (!flight) return;
    await reviewFlight({ id: flight.id, status: "REJECTED", reason: reason || undefined }).unwrap();
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duyệt chuyến bay</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Chuyến bay: </span>
            <span className="font-medium text-foreground">{flight?.flightNumber}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Đối tác: </span>
            {flight?.provider?.name}
          </p>
          <p>
            <span className="text-muted-foreground">Tuyến: </span>
            {flight?.departureAirport?.code} → {flight?.arrivalAirport?.code}
          </p>
          <p>
            <span className="text-muted-foreground">Máy bay: </span>
            {flight?.aircraft?.model} ({flight?.aircraft?.registrationCode})
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
              placeholder="Ví dụ: Số hiệu chuyến bay trùng với chuyến khác"
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
