"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteBlogPostMutation } from "@/features/blog/api/blog.api";
import type { BlogPost } from "@/features/blog/types/blog.types";

export function DeleteBlogDialog({
  open,
  onOpenChange,
  post,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
}) {
  const [deletePost, { isLoading }] = useDeleteBlogPostMutation();

  const handleConfirm = async () => {
    if (!post) return;
    await deletePost(post.id).unwrap();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá bài viết</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xoá <span className="font-medium text-foreground">{post?.title}</span>?
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
