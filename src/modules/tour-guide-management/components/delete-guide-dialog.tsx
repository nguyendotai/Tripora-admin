"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteGuideMutation } from "@/features/tour-guide/api/tour-guide.api";
import type { TourGuide } from "@/features/tour-guide/types/tour-guide.types";

export function DeleteGuideDialog({
  open,
  onOpenChange,
  guide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guide: TourGuide | null;
}) {
  const [deleteGuide, { isLoading }] = useDeleteGuideMutation();

  const handleConfirm = async () => {
    if (!guide) return;
    await deleteGuide(guide.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá hướng dẫn viên</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá{" "}
          <span className="font-medium text-foreground">{guide?.user.email}</span> khỏi danh sách
          hướng dẫn viên? Người này sẽ bị gỡ khỏi mọi ngày khởi hành đang được phân công.
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
