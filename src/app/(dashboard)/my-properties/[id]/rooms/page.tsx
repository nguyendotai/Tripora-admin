"use client";

import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListMyPropertiesQuery } from "@/features/property/api/property.api";
import { useListMyRoomsQuery, useUpdateRoomMutation } from "@/features/room/api/room.api";
import type { Room } from "@/features/room/types/room.types";
import { DeleteRoomDialog } from "@/modules/room-management/components/delete-room-dialog";
import { RoomFormDialog } from "@/modules/room-management/components/room-form-dialog";
import { RoomStatusBadge } from "@/modules/room-management/components/room-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

function formatPrice(price: string, currency: string) {
  const value = Number(price);
  return `${value.toLocaleString("vi-VN")} ${currency}`;
}

export default function PropertyRoomsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const propertyId = params.id;
  const user = useAppSelector((state) => state.auth.user);

  const { data: properties } = useListMyPropertiesQuery();
  const property = properties?.items.find((p) => p.id === propertyId);

  const { data: rooms, isLoading, isError } = useListMyRoomsQuery(propertyId);
  const [updateRoom] = useUpdateRoomMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [deleting, setDeleting] = useState<Room | null>(null);

  useEffect(() => {
    if (user && !user.providerId) {
      router.replace("/");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditing(room);
    setFormOpen(true);
  };

  const toggleStatus = (room: Room) => {
    updateRoom({
      id: room.id,
      propertyId,
      data: { status: room.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
    });
  };

  return (
    <>
      <Header title={property ? `Phòng — ${property.name}` : "Quản lý phòng"} />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách loại phòng</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" /> Thêm loại phòng
            </Button>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách phòng. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !rooms || rooms.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Chưa có loại phòng nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm loại phòng&quot; để tạo loại phòng đầu tiên.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phòng</TableHead>
                  <TableHead>Sức chứa</TableHead>
                  <TableHead>Giá / đêm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {room.capacity ? `${room.capacity} khách` : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(room.basePrice, room.currency)}
                    </TableCell>
                    <TableCell>
                      <RoomStatusBadge status={room.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        title={room.status === "ACTIVE" ? "Ẩn khỏi trang công khai" : "Mở bán lại"}
                        onClick={() => toggleStatus(room)}
                      >
                        {room.status === "ACTIVE" ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(room)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(room)}
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

      <RoomFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        propertyId={propertyId}
        room={editing}
      />
      <DeleteRoomDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        propertyId={propertyId}
        room={deleting}
      />
    </>
  );
}
