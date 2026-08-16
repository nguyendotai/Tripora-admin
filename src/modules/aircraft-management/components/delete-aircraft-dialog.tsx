"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAircraftMutation } from "@/features/aircraft/api/aircraft.api";
import type { Aircraft } from "@/features/aircraft/types/aircraft.types";

export function DeleteAircraftDialog({
  open,
  onOpenChange,
  aircraft,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aircraft: Aircraft | null;
}) {
  const [deleteAircraft, { isLoading }] = useDeleteAircraftMutation();

  const handleConfirm = async () => {
    if (!aircraft) return;
    await deleteAircraft(aircraft.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá máy bay</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá{" "}
          <span className="font-medium text-foreground">
            {aircraft?.model} ({aircraft?.registrationCode})
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
