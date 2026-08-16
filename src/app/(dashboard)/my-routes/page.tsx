"use client";

import { CalendarRange, Pencil, Plus, Trash2 } from "lucide-react";
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
import { useListMyTransportRoutesQuery } from "@/features/transport-route/api/transport-route.api";
import type { TransportRoute } from "@/features/transport-route/types/transport-route.types";
import { DeleteTransportRouteDialog } from "@/modules/transport-route-management/components/delete-transport-route-dialog";
import { TransportRouteFormDialog } from "@/modules/transport-route-management/components/transport-route-form-dialog";
import { TransportRouteStatusBadge } from "@/modules/transport-route-management/components/transport-route-status-badge";
import { TransportScheduleDialog } from "@/modules/transport-route-management/components/transport-schedule-dialog";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

export default function MyRoutesPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyTransportRoutesQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TransportRoute | null>(null);
  const [deleting, setDeleting] = useState<TransportRoute | null>(null);
  const [scheduleRoute, setScheduleRoute] = useState<TransportRoute | null>(null);

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "TRANSPORT")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (route: TransportRoute) => {
    setEditing(route);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Tuyến đường của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách tuyến đường</p>
            <Button size="sm" className="rounded-full" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" /> Thêm tuyến đường
            </Button>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách tuyến đường. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Bạn chưa có tuyến đường nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm tuyến đường&quot; để tạo tuyến đầu tiên. Tuyến mới sẽ ở trạng thái
                chờ duyệt trước khi hiển thị công khai.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tuyến</TableHead>
                  <TableHead>Thời gian dự kiến</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">
                      {route.origin} → {route.destination}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {route.estimatedDuration ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(route.price, route.currency)}
                    </TableCell>
                    <TableCell>
                      <TransportRouteStatusBadge status={route.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        title="Lịch chạy"
                        onClick={() => setScheduleRoute(route)}
                      >
                        <CalendarRange className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(route)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setDeleting(route)}
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

      <TransportRouteFormDialog open={formOpen} onOpenChange={setFormOpen} route={editing} />
      <DeleteTransportRouteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        route={deleting}
      />
      <TransportScheduleDialog
        open={!!scheduleRoute}
        onOpenChange={(open) => !open && setScheduleRoute(null)}
        route={scheduleRoute}
      />
    </>
  );
}
