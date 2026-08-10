'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { type Destination, useListDestinationsQuery } from '@/features/destination';
import { DestinationFormDialog } from '@/modules/destination-management/components/destination-form-dialog';
import { DeleteDestinationDialog } from '@/modules/destination-management/components/delete-destination-dialog';

export default function DestinationsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useListDestinationsQuery({ q: search || undefined });

  const [formOpen, setFormOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [deletingDestination, setDeletingDestination] = useState<Destination | null>(null);

  const openCreateForm = () => {
    setEditingDestination(null);
    setFormOpen(true);
  };

  const openEditForm = (destination: Destination) => {
    setEditingDestination(destination);
    setFormOpen(true);
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-bold">Destinations</h1>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-xs"
          />
          <Button onClick={openCreateForm}>
            <Plus className="size-4" />
            Thêm điểm đến
          </Button>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Quốc gia</TableHead>
                <TableHead className="w-24 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    Đang tải...
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-destructive">
                    Không thể tải danh sách điểm đến. Kiểm tra lại Backend.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    Chưa có điểm đến nào.
                  </TableCell>
                </TableRow>
              )}

              {data?.items.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell className="font-medium">{destination.name}</TableCell>
                  <TableCell className="text-muted-foreground">{destination.slug}</TableCell>
                  <TableCell className="text-muted-foreground">{destination.country ?? '—'}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Sửa"
                        onClick={() => openEditForm(destination)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Xoá"
                        onClick={() => setDeletingDestination(destination)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <DestinationFormDialog open={formOpen} onOpenChange={setFormOpen} destination={editingDestination} />
      <DeleteDestinationDialog
        open={Boolean(deletingDestination)}
        onOpenChange={(open) => !open && setDeletingDestination(null)}
        destination={deletingDestination}
      />
    </>
  );
}
