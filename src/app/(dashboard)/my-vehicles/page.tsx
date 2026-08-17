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
import { useListMyVehiclesQuery } from "@/features/vehicle/api/vehicle.api";
import type { Vehicle } from "@/features/vehicle/types/vehicle.types";
import { DeleteVehicleDialog } from "@/modules/vehicle-management/components/delete-vehicle-dialog";
import { VehicleFormDialog } from "@/modules/vehicle-management/components/vehicle-form-dialog";
import { VehicleStatusBadge } from "@/modules/vehicle-management/components/vehicle-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";

const TYPE_LABELS: Record<string, string> = {
  CAR: "Xe 4 chỗ",
  SUV: "SUV",
  VAN: "Xe 7-16 chỗ",
  BUS: "Xe khách/Bus",
  MOTORBIKE: "Xe máy",
};

export default function MyVehiclesPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyVehiclesQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState<Vehicle | null>(null);

  // V7 vòng 2: Booking/Finance Staff xem được (API cho phép), nhưng không quản lý được (403 nếu
  // gọi) — ẩn nút cho gọn, không phải lớp bảo mật thật (Backend đã chặn).
  const canManage = !user?.orgRole || user.orgRole === "OWNER" || user.orgRole === "MANAGER";

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "TRANSPORT")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditing(vehicle);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Xe của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách xe</p>
            {canManage && (
              <Button size="sm" className="rounded-full" onClick={openCreate}>
                <Plus className="mr-1.5 h-4 w-4" /> Thêm xe
              </Button>
            )}
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách xe. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Bạn chưa có xe nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm xe&quot; để đăng ký xe đầu tiên. Xe mới sẽ ở trạng thái chờ duyệt
                trước khi hiển thị công khai.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên xe</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Sức chứa</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {TYPE_LABELS[vehicle.type] ?? vehicle.type}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.licensePlate}</TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.capacity} chỗ</TableCell>
                    <TableCell>
                      <VehicleStatusBadge status={vehicle.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {canManage && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => openEdit(vehicle)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-destructive hover:text-destructive"
                            onClick={() => setDeleting(vehicle)}
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

      <VehicleFormDialog open={formOpen} onOpenChange={setFormOpen} vehicle={editing} />
      <DeleteVehicleDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        vehicle={deleting}
      />
    </>
  );
}
