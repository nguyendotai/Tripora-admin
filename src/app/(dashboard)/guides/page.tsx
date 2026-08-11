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
import { useListTravelGuidesQuery } from "@/features/travel-guide/api/travel-guide.api";
import type { TravelGuide } from "@/features/travel-guide/types/travel-guide.types";
import { DeleteGuideDialog } from "@/modules/guide-management/components/delete-guide-dialog";
import { GuideFormDialog } from "@/modules/guide-management/components/guide-form-dialog";
import { Header } from "@/shared/components/header";

export default function GuidesManagementPage() {
  const { data, isLoading, isError } = useListTravelGuidesQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TravelGuide | null>(null);
  const [deleting, setDeleting] = useState<TravelGuide | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (guide: TravelGuide) => {
    setEditing(guide);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Cẩm nang" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách cẩm nang</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" /> Thêm cẩm nang
            </Button>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách cẩm nang. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có bài cẩm nang nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm cẩm nang&quot; để tạo bài đầu tiên.
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
                {data.items.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell className="font-medium">{guide.title}</TableCell>
                    <TableCell className="text-muted-foreground">{guide.slug}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(guide)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(guide)}
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

      <GuideFormDialog open={formOpen} onOpenChange={setFormOpen} guide={editing} />
      <DeleteGuideDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        guide={deleting}
      />
    </>
  );
}
