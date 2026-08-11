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
import { useListDestinationsQuery } from "@/features/destination/api/destination.api";
import type { Destination } from "@/features/destination/types/destination.types";
import { DeleteDestinationDialog } from "@/modules/destination-management/components/delete-destination-dialog";
import { DestinationFormDialog } from "@/modules/destination-management/components/destination-form-dialog";
import { Header } from "@/shared/components/header";

export default function DestinationsManagementPage() {
  const { data, isLoading, isError } = useListDestinationsQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [deleting, setDeleting] = useState<Destination | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (destination: Destination) => {
    setEditing(destination);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Điểm đến" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách điểm đến</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" /> Thêm điểm đến
            </Button>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách điểm đến. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có điểm đến nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm điểm đến&quot; để tạo điểm đến đầu tiên.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Quốc gia</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((destination) => (
                  <TableRow key={destination.id}>
                    <TableCell className="font-medium">{destination.name}</TableCell>
                    <TableCell>{destination.country ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {destination.slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(destination)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(destination)}
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

      <DestinationFormDialog open={formOpen} onOpenChange={setFormOpen} destination={editing} />
      <DeleteDestinationDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        destination={deleting}
      />
    </>
  );
}
