"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListCommentsForModerationQuery } from "@/features/comment/api/comment.api";
import type { Comment } from "@/features/comment/types/comment.types";
import { DeleteCommentDialog } from "@/modules/comment-management/components/delete-comment-dialog";
import { Header } from "@/shared/components/header";

function authorName(comment: Comment) {
  const name = [comment.user?.firstName, comment.user?.lastName].filter(Boolean).join(" ");
  return name || `User #${comment.userId}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

export default function CommentsManagementPage() {
  const { data, isLoading, isError } = useListCommentsForModerationQuery({ limit: 50 });
  const [deleting, setDeleting] = useState<Comment | null>(null);

  return (
    <>
      <Header title="Bình luận" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Kiểm duyệt bình luận</p>
            {data && (
              <Badge variant="secondary" className="rounded-full">
                {data.pagination.totalItems} bình luận
              </Badge>
            )}
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách bình luận. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có bình luận nào</p>
              <p className="text-xs text-muted-foreground">
                Bình luận từ Traveler sẽ xuất hiện ở đây để kiểm duyệt.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Thuộc bài viết</TableHead>
                  <TableHead>Ngày bình luận</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell className="text-muted-foreground">{authorName(comment)}</TableCell>
                    <TableCell className="max-w-xs truncate" title={comment.content}>
                      {comment.content}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground" title={comment.post?.caption}>
                      {comment.post?.caption ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(comment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <DeleteCommentDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        comment={deleting}
      />
    </>
  );
}
