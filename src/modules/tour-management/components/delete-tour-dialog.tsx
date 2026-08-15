"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTourMutation } from "@/features/tour/api/tour.api";
import type { Tour } from "@/features/tour/types/tour.types";

export function DeleteTourDialog({
  open,
  onOpenChange,
  tour,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tour: Tour | null;
}) {
  const [deleteTour, { isLoading }] = useDeleteTourMutation();

  const handleConfirm = async () => {
    if (!tour) return;
    await deleteTour(tour.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá tour</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá <span className="font-medium text-foreground">{tour?.title}</span>?
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
