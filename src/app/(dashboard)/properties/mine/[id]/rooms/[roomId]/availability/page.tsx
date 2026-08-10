'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { type RoomAvailability, useListRoomAvailabilityQuery } from '@/features/room-availability';
import { UpsertAvailabilityDialog } from '@/modules/room-availability-management/components/upsert-availability-dialog';
import { EditAvailabilityDialog } from '@/modules/room-availability-management/components/edit-availability-dialog';

interface AvailabilityPageProps {
  params: Promise<{ id: string; roomId: string }>;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysFromNowIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function AvailabilityPage({ params }: AvailabilityPageProps) {
  const { id: propertyId, roomId } = use(params);
  const { data: rows, isLoading, isError } = useListRoomAvailabilityQuery({
    roomId,
    from: todayIso(),
    to: daysFromNowIso(90),
  });

  const [upsertOpen, setUpsertOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<RoomAvailability | null>(null);

  return (
    <>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <Link href={`/properties/mine/${propertyId}/rooms`} className="text-xs text-muted-foreground hover:text-foreground">
            ← Hạng phòng
          </Link>
          <h1 className="text-lg font-bold">Tồn kho theo ngày (90 ngày tới)</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-end">
          <Button onClick={() => setUpsertOpen(true)}>
            <Plus className="size-4" />
            Thêm / cập nhật theo ngày
          </Button>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Tổng số phòng</TableHead>
                <TableHead>Còn trống</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-16 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    Đang tải...
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-destructive">
                    Không thể tải tồn kho.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && rows?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    Chưa có dữ liệu tồn kho cho 90 ngày tới.
                  </TableCell>
                </TableRow>
              )}

              {rows?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.date.slice(0, 10)}</TableCell>
                  <TableCell className="text-muted-foreground">{row.total}</TableCell>
                  <TableCell className="text-muted-foreground">{row.available}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {Number(row.price).toLocaleString('vi-VN')}đ
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.status}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Sửa"
                        onClick={() => setEditingRow(row)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <UpsertAvailabilityDialog open={upsertOpen} onOpenChange={setUpsertOpen} roomId={roomId} />
      <EditAvailabilityDialog
        open={Boolean(editingRow)}
        onOpenChange={(open) => !open && setEditingRow(null)}
        availability={editingRow}
      />
    </>
  );
}
