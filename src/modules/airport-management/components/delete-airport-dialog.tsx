"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAirportMutation } from "@/features/airport/api/airport.api";
import type { Airport } from "@/features/airport/types/airport.types";

export function DeleteAirportDialog({
  open,
  onOpenChange,
  airport,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  airport: Airport | null;
}) {
  const [deleteAirport, { isLoading }] = useDeleteAirportMutation();

  const handleConfirm = async () => {
    if (!airport) return;
    await deleteAirport(airport.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá sân bay</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá{" "}
          <span className="font-medium text-foreground">
            {airport?.name} ({airport?.code})
          </span>
          ?
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
