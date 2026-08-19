"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeletePostMutation } from "@/features/post/api/post.api";
import type { Post } from "@/features/post/types/post.types";

export function DeletePostDialog({
  open,
  onOpenChange,
  post,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
}) {
  const [deletePost, { isLoading }] = useDeletePostMutation();

  const handleConfirm = async () => {
    if (!post) return;
    await deletePost(post.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gỡ bài viết</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn gỡ bài viết này? Người dùng sẽ không còn thấy bài viết này công khai và
          sẽ nhận được thông báo.
        </p>
        {post?.caption && (
          <p className="rounded-[var(--radius-md)] bg-muted p-3 text-sm text-foreground">
            &quot;{post.caption}&quot;
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
            {isLoading ? "Đang gỡ..." : "Gỡ bài viết"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
