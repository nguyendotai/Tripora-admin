"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteReviewMutation } from "@/features/review/api/review.api";
import type { Review } from "@/features/review/types/review.types";

export function DeleteReviewDialog({
  open,
  onOpenChange,
  review,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
}) {
  const [deleteReview, { isLoading }] = useDeleteReviewMutation();

  const handleConfirm = async () => {
    if (!review) return;
    await deleteReview(review.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gỡ đánh giá</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn gỡ đánh giá này? Người dùng sẽ không còn thấy đánh giá này công khai.
        </p>
        {review?.content && (
          <p className="rounded-[var(--radius-md)] bg-muted p-3 text-sm text-foreground">
            &quot;{review.content}&quot;
          </p>
        )}

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
            {isLoading ? "Đang gỡ..." : "Gỡ đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
