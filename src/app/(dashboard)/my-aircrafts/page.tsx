"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useListMyAircraftQuery } from "@/features/aircraft/api/aircraft.api";
import type { Aircraft } from "@/features/aircraft/types/aircraft.types";
import { AircraftFormDialog } from "@/modules/aircraft-management/components/aircraft-form-dialog";
import { AircraftStatusBadge } from "@/modules/aircraft-management/components/aircraft-status-badge";
import { DeleteAircraftDialog } from "@/modules/aircraft-management/components/delete-aircraft-dialog";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";

export default function MyAircraftsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyAircraftQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Aircraft | null>(null);
  const [deleting, setDeleting] = useState<Aircraft | null>(null);

  // V7 vòng 2: Booking/Finance Staff xem được (API cho phép), nhưng không quản lý được (403 nếu
  // gọi) — ẩn nút cho gọn, không phải lớp bảo mật thật (Backend đã chặn).
  const canManage = !user?.orgRole || user.orgRole === "OWNER" || user.orgRole === "MANAGER";

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "FLIGHT")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (aircraft: Aircraft) => {
    setEditing(aircraft);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Máy bay của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách máy bay</p>
            {canManage && (
              <Button size="sm" className="rounded-full" onClick={openCreate}>
                <Plus className="mr-1.5 h-4 w-4" /> Thêm máy bay
              </Button>
            )}
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách máy bay. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Bạn chưa có máy bay nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm máy bay&quot; để đăng ký máy bay đầu tiên. Máy bay mới sẽ ở trạng
                thái chờ duyệt trước khi có thể gắn vào chuyến bay.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Số hiệu</TableHead>
                  <TableHead>Sức chứa</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((aircraft) => (
                  <TableRow key={aircraft.id}>
                    <TableCell className="font-medium">{aircraft.model}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {aircraft.registrationCode}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {aircraft.economyCapacity} Economy
                      {aircraft.businessCapacity > 0 ? ` + ${aircraft.businessCapacity} Business` : ""}
                    </TableCell>
                    <TableCell>
                      <AircraftStatusBadge status={aircraft.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {canManage && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => openEdit(aircraft)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-destructive hover:text-destructive"
                            onClick={() => setDeleting(aircraft)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <AircraftFormDialog open={formOpen} onOpenChange={setFormOpen} aircraft={editing} />
      <DeleteAircraftDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        aircraft={deleting}
      />
    </>
  );
}
