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
import { useListPostsQuery } from "@/features/post/api/post.api";
import type { Post } from "@/features/post/types/post.types";
import { DeletePostDialog } from "@/modules/post-management/components/delete-post-dialog";
import { Header } from "@/shared/components/header";

function authorName(post: Post) {
  const name = [post.user?.firstName, post.user?.lastName].filter(Boolean).join(" ");
  return name || `User #${post.userId}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

export default function PostsManagementPage() {
  const { data, isLoading, isError } = useListPostsQuery({ limit: 50 });
  const [deleting, setDeleting] = useState<Post | null>(null);

  return (
    <>
      <Header title="Bài viết cộng đồng" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Kiểm duyệt bài viết</p>
            {data && (
              <Badge variant="secondary" className="rounded-full">
                {data.pagination.totalItems} bài viết
              </Badge>
            )}
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách bài viết. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có bài viết nào</p>
              <p className="text-xs text-muted-foreground">
                Bài viết từ Traveler sẽ xuất hiện ở đây để kiểm duyệt.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="text-muted-foreground">{authorName(post)}</TableCell>
                    <TableCell className="max-w-xs truncate" title={post.caption}>
                      {post.caption}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{post.images.length}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {post.destination?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(post)}
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

      <DeletePostDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        post={deleting}
      />
    </>
  );
}
