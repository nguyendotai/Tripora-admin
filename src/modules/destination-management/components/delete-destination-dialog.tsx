"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteDestinationMutation } from "@/features/destination/api/destination.api";
import type { Destination } from "@/features/destination/types/destination.types";

export function DeleteDestinationDialog({
  open,
  onOpenChange,
  destination,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: Destination | null;
}) {
  const [deleteDestination, { isLoading }] = useDeleteDestinationMutation();

  const handleConfirm = async () => {
    if (!destination) return;
    await deleteDestination(destination.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá điểm đến</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá <span className="font-medium text-foreground">{destination?.name}</span>?
          Hành động này có thể hoàn tác bằng cách liên hệ kỹ thuật (soft delete).
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
