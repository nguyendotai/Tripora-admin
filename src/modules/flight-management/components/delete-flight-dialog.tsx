"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteFlightMutation } from "@/features/flight/api/flight.api";
import type { Flight } from "@/features/flight/types/flight.types";

export function DeleteFlightDialog({
  open,
  onOpenChange,
  flight,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flight: Flight | null;
}) {
  const [deleteFlight, { isLoading }] = useDeleteFlightMutation();

  const handleConfirm = async () => {
    if (!flight) return;
    await deleteFlight(flight.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá chuyến bay</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá chuyến{" "}
          <span className="font-medium text-foreground">{flight?.flightNumber}</span>?
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            className="rounded-full"
            onClick={handleConfirm}
          >
            {isLoading ? "Đang xoá..." : "Xoá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
