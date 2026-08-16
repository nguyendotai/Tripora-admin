"use client";

import { Pencil, Power, Trash2, UserPlus } from "lucide-react";
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
import { useListMyDriversQuery, useUpdateDriverMutation } from "@/features/driver/api/driver.api";
import type { Driver } from "@/features/driver/types/driver.types";
import { DeleteDriverDialog } from "@/modules/driver-management/components/delete-driver-dialog";
import { DriverFormDialog } from "@/modules/driver-management/components/driver-form-dialog";
import { DriverStatusBadge } from "@/modules/driver-management/components/driver-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";

export default function MyDriversPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyDriversQuery();
  const [updateDriver] = useUpdateDriverMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [deleting, setDeleting] = useState<Driver | null>(null);

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "TRANSPORT")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (driver: Driver) => {
    setEditing(driver);
    setFormOpen(true);
  };

  const toggleStatus = (driver: Driver) => {
    updateDriver({
      id: driver.id,
      data: { status: driver.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
    });
  };

  return (
    <>
      <Header title="Tài xế" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách tài xế</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <UserPlus className="mr-1.5 h-4 w-4" /> Thêm tài xế
            </Button>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách tài xế. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Bạn chưa có tài xế nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm tài xế&quot; để tạo hồ sơ tài xế đầu tiên.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Số bằng lái</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell className="text-muted-foreground">{driver.phone ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {driver.licenseNumber ?? "—"}
                    </TableCell>
                    <TableCell>
                      <DriverStatusBadge status={driver.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        title={driver.status === "ACTIVE" ? "Tạm ngừng" : "Kích hoạt lại"}
                        onClick={() => toggleStatus(driver)}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(driver)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(driver)}
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

      <DriverFormDialog open={formOpen} onOpenChange={setFormOpen} driver={editing} />
      <DeleteDriverDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        driver={deleting}
      />
    </>
  );
}
