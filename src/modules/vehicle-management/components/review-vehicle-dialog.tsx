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
import { useReviewVehicleMutation } from "@/features/vehicle/api/vehicle.api";
import type { Vehicle } from "@/features/vehicle/types/vehicle.types";

export function ReviewVehicleDialog({
  open,
  onOpenChange,
  vehicle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}) {
  const [reviewVehicle, { isLoading }] = useReviewVehicleMutation();
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
    if (!vehicle) return;
    await reviewVehicle({ id: vehicle.id, status: "APPROVED" }).unwrap();
    handleOpenChange(false);
  };

  const handleReject = async () => {
    if (!vehicle) return;
    await reviewVehicle({ id: vehicle.id, status: "REJECTED", reason: reason || undefined }).unwrap();
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duyệt xe</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Tên xe: </span>
            <span className="font-medium text-foreground">{vehicle?.name}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Đối tác: </span>
            {vehicle?.provider?.name}
          </p>
          <p>
            <span className="text-muted-foreground">Biển số: </span>
            {vehicle?.licensePlate}
          </p>
          <p>
            <span className="text-muted-foreground">Sức chứa: </span>
            {vehicle?.capacity} chỗ
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
              placeholder="Ví dụ: Biển số không rõ ràng trong ảnh"
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
