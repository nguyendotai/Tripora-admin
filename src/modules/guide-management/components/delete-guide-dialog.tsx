"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTravelGuideMutation } from "@/features/travel-guide/api/travel-guide.api";
import type { TravelGuide } from "@/features/travel-guide/types/travel-guide.types";

export function DeleteGuideDialog({
  open,
  onOpenChange,
  guide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guide: TravelGuide | null;
}) {
  const [deleteGuide, { isLoading }] = useDeleteTravelGuideMutation();

  const handleConfirm = async () => {
    if (!guide) return;
    await deleteGuide(guide.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá cẩm nang</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá <span className="font-medium text-foreground">{guide?.title}</span>?
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
