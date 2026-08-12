"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListBlogPostsQuery } from "@/features/blog/api/blog.api";
import type { BlogPost } from "@/features/blog/types/blog.types";
import { BlogFormDialog } from "@/modules/blog-management/components/blog-form-dialog";
import { DeleteBlogDialog } from "@/modules/blog-management/components/delete-blog-dialog";
import { Header } from "@/shared/components/header";

export default function BlogManagementPage() {
  const { data, isLoading, isError } = useListBlogPostsQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Blog" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách bài viết</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" /> Thêm bài viết
            </Button>
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
                Bấm &quot;Thêm bài viết&quot; để tạo bài đầu tiên.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="text-muted-foreground">{post.slug}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
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

      <BlogFormDialog open={formOpen} onOpenChange={setFormOpen} post={editing} />
      <DeleteBlogDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        post={deleting}
      />
    </>
  );
}
