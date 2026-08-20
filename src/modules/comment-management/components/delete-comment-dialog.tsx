"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteCommentMutation } from "@/features/comment/api/comment.api";
import type { Comment } from "@/features/comment/types/comment.types";

export function DeleteCommentDialog({
  open,
  onOpenChange,
  comment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: Comment | null;
}) {
  const [deleteComment, { isLoading }] = useDeleteCommentMutation();

  const handleConfirm = async () => {
    if (!comment) return;
    await deleteComment(comment.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gỡ bình luận</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn gỡ bình luận này? Người dùng sẽ không còn thấy bình luận này công khai và
          sẽ nhận được thông báo.
        </p>
        {comment?.content && (
          <p className="rounded-[var(--radius-md)] bg-muted p-3 text-sm text-foreground">
            &quot;{comment.content}&quot;
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
            {isLoading ? "Đang gỡ..." : "Gỡ bình luận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
