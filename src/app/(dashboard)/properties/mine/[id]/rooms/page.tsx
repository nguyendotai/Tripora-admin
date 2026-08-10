'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { CalendarRange, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { type Room, useListMyRoomsQuery } from '@/features/room';
import { RoomFormDialog } from '@/modules/room-management/components/room-form-dialog';
import { DeleteRoomDialog } from '@/modules/room-management/components/delete-room-dialog';

interface RoomsPageProps {
  params: Promise<{ id: string }>;
}

export default function RoomsPage({ params }: RoomsPageProps) {
  const { id: propertyId } = use(params);
  const { data: rooms, isLoading, isError } = useListMyRoomsQuery(propertyId);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  const openCreateForm = () => {
    setEditingRoom(null);
    setFormOpen(true);
  };

  const openEditForm = (room: Room) => {
    setEditingRoom(room);
    setFormOpen(true);
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <Link href="/properties/mine" className="text-xs text-muted-foreground hover:text-foreground">
            ← Property của tôi
          </Link>
          <h1 className="text-lg font-bold">Hạng phòng</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-end">
          <Button onClick={openCreateForm}>
            <Plus className="size-4" />
            Thêm hạng phòng
          </Button>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Sức chứa</TableHead>
                <TableHead>Giá cơ bản</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-32 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Đang tải...
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-destructive">
                    Không thể tải danh sách hạng phòng.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && rooms?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Chưa có hạng phòng nào.
                  </TableCell>
                </TableRow>
              )}

              {rooms?.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {room.capacityAdults} người lớn, {room.capacityChildren} trẻ em
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {Number(room.basePrice).toLocaleString('vi-VN')}đ
                  </TableCell>
                  <TableCell className="text-muted-foreground">{room.status}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/properties/mine/${propertyId}/rooms/${room.id}/availability`}
                        className="inline-flex size-8 items-center justify-center rounded-md hover:bg-secondary"
                        aria-label="Quản lý tồn kho"
                      >
                        <CalendarRange className="size-4" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Sửa"
                        onClick={() => openEditForm(room)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Xoá"
                        onClick={() => setDeletingRoom(room)}
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

      <RoomFormDialog open={formOpen} onOpenChange={setFormOpen} propertyId={propertyId} room={editingRoom} />
      <DeleteRoomDialog
        open={Boolean(deletingRoom)}
        onOpenChange={(open) => !open && setDeletingRoom(null)}
        room={deletingRoom}
      />
    </>
  );
}
