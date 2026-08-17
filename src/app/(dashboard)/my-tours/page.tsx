"use client";

import { CalendarRange, MapPinned, Pencil, Plus, Trash2 } from "lucide-react";
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
import { useListMyToursQuery } from "@/features/tour/api/tour.api";
import type { Tour } from "@/features/tour/types/tour.types";
import { DeleteTourDialog } from "@/modules/tour-management/components/delete-tour-dialog";
import { TourFormDialog } from "@/modules/tour-management/components/tour-form-dialog";
import { TourItineraryDialog } from "@/modules/tour-management/components/tour-itinerary-dialog";
import { TourScheduleDialog } from "@/modules/tour-management/components/tour-schedule-dialog";
import { TourStatusBadge } from "@/modules/tour-management/components/tour-status-badge";
import { Header } from "@/shared/components/header";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getProviderHomePath } from "@/shared/utils/provider-routes";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

export default function MyToursPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useListMyToursQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [deleting, setDeleting] = useState<Tour | null>(null);
  const [itineraryTour, setItineraryTour] = useState<Tour | null>(null);
  const [scheduleTour, setScheduleTour] = useState<Tour | null>(null);

  // V7 vòng 2: Booking/Finance Staff xem được (API cho phép), nhưng không quản lý được (403 nếu
  // gọi) — ẩn nút cho gọn, không phải lớp bảo mật thật (Backend đã chặn).
  const canManage = !user?.orgRole || user.orgRole === "OWNER" || user.orgRole === "MANAGER";

  useEffect(() => {
    if (user && (!user.providerId || user.providerType !== "TOUR")) {
      router.replace(user.providerId ? getProviderHomePath(user.providerType) : "/");
    }
  }, [user, router]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (tour: Tour) => {
    setEditing(tour);
    setFormOpen(true);
  };

  return (
    <>
      <Header title="Tour của tôi" />

      <main className="p-6">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="font-semibold">Danh sách tour</p>
            {canManage && (
              <Button size="sm" className="rounded-full" onClick={openCreate}>
                <Plus className="mr-1.5 h-4 w-4" /> Thêm tour
              </Button>
            )}
          </div>

          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="p-6 text-sm text-destructive">
              Không tải được danh sách tour. Kiểm tra Backend/kết nối MySQL.
            </p>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 p-10 text-center">
              <p className="text-sm font-medium">Bạn chưa có tour nào</p>
              <p className="text-xs text-muted-foreground">
                Bấm &quot;Thêm tour&quot; để tạo tour đầu tiên. Tour mới sẽ ở trạng thái chờ
                duyệt trước khi hiển thị công khai.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tour</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((tour) => (
                  <TableRow key={tour.id}>
                    <TableCell className="font-medium">{tour.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {tour.durationLabel ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(tour.price, tour.currency)}
                    </TableCell>
                    <TableCell>
                      <TourStatusBadge status={tour.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {canManage && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            title="Lịch trình"
                            onClick={() => setItineraryTour(tour)}
                          >
                            <MapPinned className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            title="Ngày khởi hành"
                            onClick={() => setScheduleTour(tour)}
                          >
                            <CalendarRange className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => openEdit(tour)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-destructive hover:text-destructive"
                            onClick={() => setDeleting(tour)}
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

      <TourFormDialog open={formOpen} onOpenChange={setFormOpen} tour={editing} />
      <DeleteTourDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        tour={deleting}
      />
      <TourItineraryDialog
        open={!!itineraryTour}
        onOpenChange={(open) => !open && setItineraryTour(null)}
        tour={itineraryTour}
      />
      <TourScheduleDialog
        open={!!scheduleTour}
        onOpenChange={(open) => !open && setScheduleTour(null)}
        tour={scheduleTour}
      />
    </>
  );
}
